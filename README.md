# Vagrant Zabbix

## What is Vagrant?

Vagrant is a tool that uses Oracle's VirtualBox to dynamically build configurable, lightweight, and portable virtual machines. Vagrant supports the use of either Puppet or Chef for managing the configuration. Much more information is available on the [Vagrant web site](http://www.vagrantup.com).

## What is this project?

This is the Vagrant configuration used in my boxes for [Zabbix](https://www.zabbix.com/) at [VagrantCloud](https://app.vagrantup.com/isaqueprofeta). They start out with:

Zabbix Server 6.0, Nginx and PostgreSQL 15 with TimescaleDB on:
  - Alma 8
  - Rocky 8
  - Debian 11
  - Ubuntu 22.04

## How do I install Vagrant?

The VirtualBox version used is 6.1 and Vagrant version is v2.2.14.

- Download VirtualBox 6.1: https://www.virtualbox.org/wiki/Downloads
- Download Vagrant 2.2.14: https://www.vagrantup.com/downloads

## How do I run?

Two options:

1. Using the VagrantCloud box: From an empty directory, Create a Vagrantfile and put in it the contents:

config.vm.box could be "isaqueprofeta/zabbix-debian11":

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "isaqueprofeta/zabbix-debian11"
  config.vm.box_version = "6.0"
  config.vm.network "forwarded_port", guest: 80 , host: 8080, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 5432 , host: 5432, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 10050 , host: 10050, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 10051 , host: 10051, host_ip: "127.0.0.1"
end
```

or "isaqueprofeta/zabbix-rocky8":

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "isaqueprofeta/zabbix-rocky8"
  config.vm.box_version = "6.0"
  config.vm.network "forwarded_port", guest: 80 , host: 8080, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 5432 , host: 5432, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 10050 , host: 10050, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 10051 , host: 10051, host_ip: "127.0.0.1"
end
```

or "isaqueprofeta/zabbix-alma8":

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "isaqueprofeta/zabbix-alma8"
  config.vm.box_version = "6.0"
  config.vm.network "forwarded_port", guest: 80 , host: 8080, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 5432 , host: 5432, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 10050 , host: 10050, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 10051 , host: 10051, host_ip: "127.0.0.1"
end
```

or "isaqueprofeta/zabbix-ubuntu2204":

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "isaqueprofeta/zabbix-ubuntu2204"
  config.vm.box_version = "6.0"
  config.vm.network "forwarded_port", guest: 80 , host: 8080, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 5432 , host: 5432, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 10050 , host: 10050, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 10051 , host: 10051, host_ip: "127.0.0.1"
end
```

Save, exit, and then type:

```sh
vagrant init isaqueprofeta/zabbix-debian11 # or centos8, or alma8, or ubuntu2204
vagrant up
```

2. Build ground up from Centos8/Debian10: Clone this repo and inside the wanted OS folder, run vagrant up.

3. Download the gist scripts and use on your own VM/Server:

  - Rocky/Alma 8: https://gist.github.com/isaqueprofeta/7ac75a4f90b9d39283e51f78ae7abaca
  - Debian 11 https://gist.github.com/isaqueprofeta/abf61686c0c086678175c7b9eaaa0508
  - Ubuntu 22.04: https://gist.github.com/isaqueprofeta/ed55bb57dcfa3e52c7bd8cc8c1b9a060

## How do I work?

0. Zabbix Frontend is forwarded from TCP/80 of guest to TCP/8080 on the host, so just go for http://localhost:8080 (User: Admin, Pass:zabbix), and you should be fine

1. Ports 5432, 10050 and 10051 are directly mapped from the guest to the host to use it as appliance and make it easier to connect to the agents and to make queries using SQL.

2. Default Zabbix Database Password: Z4bb1xD4t4b4s3

## Quick reference:

1. How to stop/turn off:

```sh
vagrant halt
```

1. How to clean/delete all data:

```sh
vagrant destroy
vagrant box prune isaqueprofeta/zabbix-debian11 # or centos8, or alma8
```

2. Create a snapshot for tests:

```sh
vagrant snapshot create MySnapshot
```

2. Recover the snapshot:

```sh
vagrant snapshot restore MySnapshot
```
