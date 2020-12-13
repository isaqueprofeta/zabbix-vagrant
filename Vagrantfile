ZABBIX_VERSION = "5.2"
POSTGRES_VERSION = "12"
CENTOS_VERSION = "centos/8"
Vagrant.configure("2") do |config|

    config.vm.define "zabbix" do |zabbix|
  
      zabbix.vm.box = CENTOS_VERSION

      zabbix.vm.hostname = "zabbix"
      zabbix.vm.network "forwarded_port", guest: 80 , host: 8080, host_ip: "127.0.0.1"
      zabbix.vm.network "forwarded_port", guest: 5432 , host: 5432, host_ip: "127.0.0.1"
      zabbix.vm.network "forwarded_port", guest: 10050 , host: 10050, host_ip: "127.0.0.1"
      zabbix.vm.network "forwarded_port", guest: 10051 , host: 10051, host_ip: "127.0.0.1"
              
      zabbix.vm.provision "shell", inline: <<-SHELL
        echo '----Disabling SELinux---- '
        sed -i "s/SELINUX=enforcing/SELINUX=disabled/" /etc/selinux/config
        setenforce 0
  
        echo '----Disabling Firewall---- '
        systemctl disable --now firewalld
        SHELL

     zabbix.vm.provision "shell", inline: <<-SHELL
        echo '----Installing PostgreSQL #{POSTGRES_VERSION}---- '
        yum -y install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
        dnf -y module disable postgresql
        dnf -y install postgresql#{POSTGRES_VERSION} postgresql#{POSTGRES_VERSION}-server
        
        echo '----Running PostgreSQL initdb---- '
        /usr/pgsql-#{POSTGRES_VERSION}/bin/postgresql-#{POSTGRES_VERSION}-setup initdb
        SHELL
  
     zabbix.vm.provision "shell", inline: <<-SHELL
        echo '----Configuring and starting PostgreSQL---- '
        sed -i "s/ident/md5/g" /var/lib/pgsql/#{POSTGRES_VERSION}/data/pg_hba.conf
        sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /var/lib/pgsql/#{POSTGRES_VERSION}/data/postgresql.conf
        systemctl enable --now postgresql-#{POSTGRES_VERSION}
  
        echo '----Creating database and user---- '
        sudo -u postgres psql -c "CREATE USER zabbix WITH ENCRYPTED PASSWORD 'Z4bb1xD4t4b4s3'" 2>/dev/null
        sudo -u postgres createdb -O zabbix -E Unicode -T template0 zabbix 2>/dev/null
        SHELL
  
      zabbix.vm.provision "shell", inline: <<-SHELL
        echo '----Installing Zabbix Server #{ZABBIX_VERSION}---- '
        rpm -Uvh https://repo.zabbix.com/zabbix/#{ZABBIX_VERSION}/rhel/8/x86_64/zabbix-release-#{ZABBIX_VERSION}-1.el8.noarch.rpm
        dnf -y install zabbix-server-pgsql
  
        echo '----Creating database schema---- '
        zcat /usr/share/doc/zabbix-server-pgsql*/create.sql.gz | sudo -u zabbix PGPASSWORD=Z4bb1xD4t4b4s3 psql -hlocalhost -Uzabbix zabbix 2>/dev/null
        SHELL
  
      zabbix.vm.provision "shell", inline: <<-SHELL
        echo '----Configuring Zabbix Server---- '
        sed -i "s/# DBHost=localhost/DBHost=localhost/" /etc/zabbix/zabbix_server.conf
        sed -i "s/# DBPassword=/DBPassword=Z4bb1xD4t4b4s3/" /etc/zabbix/zabbix_server.conf
        
        echo '----Starting Zabbix Server---- '
        systemctl enable --now zabbix-server
        SHELL
  
      web_config = <<-WEBCONFIG
  <?php
      $DB["TYPE"]				= "POSTGRESQL";
      $DB["SERVER"]			= "localhost";
      $DB["PORT"]				= "5432";
      $DB["DATABASE"]			= "zabbix";
      $DB["USER"]				= "zabbix";
      $DB["PASSWORD"]			= "Z4bb1xD4t4b4s3";
      $DB["SCHEMA"]			= "";
      $DB["ENCRYPTION"]		= false;
      $DB["KEY_FILE"]			= "";
      $DB["CERT_FILE"]		= "";
      $DB["CA_FILE"]			= "";
      $DB["VERIFY_HOST"]		= false;
      $DB["CIPHER_LIST"]		= "";
      $DB["VAULT_URL"]		= "";
      $DB["VAULT_DB_PATH"]	= "";
      $DB["VAULT_TOKEN"]		= "";
      $DB["DOUBLE_IEEE754"]	= true;
      $ZBX_SERVER				= "localhost";
      $ZBX_SERVER_PORT		= "10051";
      $ZBX_SERVER_NAME		= "zabbix";
      $IMAGE_FORMAT_DEFAULT	= IMAGE_FORMAT_PNG;
  WEBCONFIG
  
      zabbix.vm.provision "shell", inline: <<-SHELL
        echo '----Installing Zabbix Frontend for Apache---- '
        dnf -y install zabbix-web-pgsql zabbix-apache-conf
        
        echo '----Configuring Zabbix Frontend---- '
        echo "php_value[date.timezone] = America/Sao_Paulo" >> /etc/php-fpm.d/zabbix.conf
        echo '#{web_config}' > /etc/zabbix/web/zabbix.conf.php
        ln -s /etc/zabbix/web/zabbix.conf.php /usr/share/zabbix/conf/zabbix.conf.php
        ln -s /etc/zabbix/web/maintenance.inc.php /usr/share/zabbix/conf/maintenance.inc.php
        
        echo '----Starting php-fpm and Apache---- '
        systemctl enable --now php-fpm
        systemctl enable --now httpd
        SHELL
  
      zabbix.vm.provision "shell", inline: <<-SHELL
        echo '----Installing Zabbix Agent---- '
        dnf -y install zabbix-agent
        
        echo '----Starting Zabbix Agent---- '
        systemctl enable --now zabbix-agent
        SHELL
        
      zabbix.vm.provision "shell", inline: <<-SHELL
        echo '----Installing TimescaleDB---- '
        dnf -y install timescaledb_#{POSTGRES_VERSION}
        
        echo '----Stopping Zabbix-Server---- '
        systemctl stop zabbix-server
        
        echo '----Configuring TimescaleDB---- '
        echo "shared_preload_libraries = 'timescaledb'" > /var/lib/pgsql/#{POSTGRES_VERSION}/data/postgresql.conf
        systemctl restart postgresql-#{POSTGRES_VERSION}
        echo "CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;" | sudo -u postgres psql zabbix 2>/dev/null
        zcat /usr/share/doc/zabbix-server-pgsql/timescaledb.sql.gz | sudo -u zabbix psql zabbix 2>/dev/null
        
        echo '----Starting Zabbix-Server---- '
        systemctl start zabbix-server
        SHELL

      zabbix.vm.provision "shell", inline: <<-SHELL
        echo '----Cleaning up---- '
        dnf -y install zabbix-agent
        dnf -y clean all
        rm -rf /var/cache/yum /var/lib/yum/yumdb/* /usr/lib/udev/hwdb.d/*
        rm -rf /var/cache/dnf /etc/udev/hwdb.bin /root/.pki
        SHELL

    end
  
  end