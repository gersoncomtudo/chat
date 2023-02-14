1 - INSTALAR NORMAL COM INSTALADOR

2 - COMO CRIAR O APLICATIVO GERENCIANET
https://gerencianet.com.br/artigo/como-criar-uma-nova-aplicacao-para-usar-a-api-pix/#versao-7

3 - COMO CRIAR O CERTIFICADO GERENCIANET
https://gerencianet.com.br/artigo/como-gerar-o-certificado-para-usar-a-api-pix/#versao-7

4 - COPIAR OS CERTIFICADOS PARA A PASTA ```/backend/certs```

5 - CONFIGURAR .ENV ADICIONAR OS SEGUINTES DADOS

```bash
GERENCIANET_SANDBOX=false
GERENCIANET_CLIENT_ID=Client_Id_
GERENCIANET_CLIENT_SECRET=Client_Secret_
GERENCIANET_PIX_CERT=nome do certificado pix
GERENCIANET_PIX_KEY=chave pix do gerencianet
```

6 - RODE UM ```npm run build && pm2 restart all```bash PARA ATUALIZAR A INSTALAÇÃO

7 -CRIAR O WEBHOOH PARA RETORNO AUTOMATICO GERENCIANET E ENVIAR UM POST PARA O ENDEREÇO DO BACKEND COM OS DADOS EM JSON PELO POSTMAN OU COPIE O CODIGO ABAIXO ALTERE OS DADOS E COLE NO TERMINAL

CODIGO PELO SSH:
```
curl --request POST \
  --url https://backend.dominio.com.br/subscription/create/webhook \
  --header 'Content-Type: application/json' \
  --data '{ 
    "chave": "sua chave pix do gerencianet", 
    "url": "https://backend.dominio.com.br/subscription/webhook"
 }'
```

DADOS PARA POSTMAN/INSOMINIA
URL: ```https://backend.dominio.com.br/subscription/create/webhook```

```
	{ 
		"chave": "sua chave pix do gerencianet", 
		"url": "https://backend.dominio.com.br/subscription/webhook"
	}
```	
