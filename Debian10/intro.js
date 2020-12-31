/*    1) Bloco básico para controle de erros    */
try {

    /*
        Código vai aqui
    */

} catch (error) {
    // Zabbix.Log(loglevel, message)
    Zabbix.Log(3, "Mensagem de erro 'warning': "+error);
    /*
        Retorne um valor nulo de acordo com o tipo,
        senão o item vai ficar "não suportado"
    */
    return {};
    return 0;
    return "";
}

/*    2) Retornar dados simples    */

/*
    2.1) Retornar uma simples string
*/
try {

    return "Teste";

} catch (error) {
    Zabbix.Log(3, "Mensagem de erro 'warning': "+error);
    return "";
}

/*
    2.2) Retornar um numero
*/
try {
    return 100;
} catch (error) {
    Zabbix.Log(3, "Mensagem de erro 'warning': "+error);
    return 0;
}

/*
    2.3) Retornar uma lista de valores JSON 
         (para pré-processamento ou master item)
    CONCEITOS = Objeto Javascript
                JSON.stringify
                var
*/
try {

    var dadosDoItem = [
            {
                registroUmChaveUm: "registroUmValueUm",
                registroUmChaveDois: "registroUmValueDois"
            },
            {
                registroDoisChaveUm: "registroDoisValueUm",
                registroDoisChaveDois: "registroDoisValueDois"
            },
            {
                registroTresChaveUm: "registroTresValueUm",
                registroTresChaveDois: "registroTresValueDois"
            },
    ];

    return JSON.stringify(dadosDoItem);

} catch (error) {
    Zabbix.Log(3, "Mensagem de erro 'warning': "+error);
    return 0;
}

/*
    3) Retornar os parâmetros passado no item de script
       (aparece [object Object] sem o JSON.stringify)
       (aparece com escape de aspas sem o JSON.parse)
    CONCEITOS = value
                JSON.parse(value)
*/
try {

    var parametros = JSON.parse(value);

    return JSON.stringify(parametros);

} catch (error) {
    Zabbix.Log(3, "Mensagem de erro 'warning': "+error);
    return {};
}

/*
    3) Retornar um dos parâmetros passado no item de script
    CONCEITOS = JSON.parse(value)
*/
try {

    var parametros = JSON.parse(value);

    return parametros.parametroUm;

} catch (error) {
    Zabbix.Log(3, "Mensagem de erro 'warning': "+error);
    return "";
}

/*
    4) zabbix_js
    sudo apt install zabbix-js
    zabbix_js -s test.js -p '{"parametroUm": "valorUm", "parametroDois": "valorDois"}'
*/

/*
    5) Requisições HTTP simples para o próprio zabbix
    CONCEITOS = CurlHttpRequest
*/
try {

    var parametros = JSON.parse(value);
    var requisicao = new CurlHttpRequest();
    var jsonZabbix = {
        "jsonrpc": "2.0",
        "method": "user.login",
        "params": {
            "user": parametros.usuario,
            "password": parametros.senha
        },
        "id": 1
    };

    echo(jsonZabbix)
    requisicao.AddHeader('Content-Type: application/json');

    resposta = requisicao.Post(
        value.url,
        JSON.stringify(jsonZabbix)
    );

    if (requisicao.Status() != 201) {
        throw 'Response code: '+req.Status();
    }

    var resultado = JSON.parse(resposta);

    return(JSON.stringify(jsonZabbix));

} catch (error) {
    Zabbix.Log(3, "Mensagem de erro 'warning': "+error);
    return "";
}
