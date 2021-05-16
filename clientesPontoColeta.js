const PasswordHelper = require('./src/helpers/passwordHelper')

const Clientes = [

    { 
        "nome": "Boulevard Shopping",
        "documento": "04169706903",
        "telefone": "75987542393",
        "email": "pc1@gmail.com",
        "login": "pc1",
        "senha": "pc1"
    },
    { 
        "nome": "LuSoft Informática",
        "documento": "04169706902",
        "telefone": "75987542392",
        "email": "pc2@gmail.com",
        "login": "pc2",
        "senha": "pc2"
    },
    { 
        "nome": "Vida Logística Reversa",
        "documento": "04169706913",
        "telefone": "75987542313",
        "email": "pc3@gmail.com",
        "login": "pc3",
        "senha": "pc3"
    },
    { 
        "nome": "Reciclaje Logística Reversa - Brasília",
        "documento": "04169706904",
        "telefone": "75987542344",
        "email": "pc4@gmail.com",
        "login": "pc4",
        "senha": "pc4"
    },
    { 
        "nome": "Solução",
        "documento": "04169706905",
        "telefone": "75987542395",
        "email": "pc5@gmail.com",
        "login": "pc5",
        "senha": "pc5"
    },
    { 
        "nome": "Alert Materiais de Construção",
        "documento": "04169706906",
        "telefone": "75987542396",
        "email": "pc6@gmail.com",
        "login": "pc6",
        "senha": "pc6"
    },
    { 
        "nome": "Assaí Atacadista",
        "documento": "04169706907",
        "telefone": "75987542397",
        "email": "pc7@gmail.com",
        "login": "pc7",
        "senha": "pc7"
    },
    { 
        "nome": "Atacadão",
        "documento": "04169706908",
        "telefone": "75987542398",
        "email": "pc8@gmail.com",
        "login": "pc8",
        "senha": "pc8"
    },
    { 
        "nome": "Mercantil Rodrigues",
        "documento": "04169706909",
        "telefone": "75987542399",
        "email": "pc9@gmail.com",
        "login": "pc9",
        "senha": "pc9"
    },
    { 
        "nome": "Pintebem",
        "documento": "04169706910",
        "telefone": "75987542310",
        "email": "pc10@gmail.com",
        "login": "pc10",
        "senha": "pc10"
    },
    { 
        "nome": "Teste",
        "documento": "04169706900",
        "telefone": "75987542896",
        "email": "teste@gmail.com",
        "login": "teste",
        "senha": "teste"
    },
]

Clientes.forEach(async element => {
    element.senha = await PasswordHelper.hashPassword(element.senha)
});


module.exports = Clientes;