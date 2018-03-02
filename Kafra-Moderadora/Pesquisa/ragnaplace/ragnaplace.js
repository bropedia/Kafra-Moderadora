/****************************************************************************************************
* Autor: MBrauna & Lazarento                                                      Data: 21/02/2018 *
****************************************************************************************************
*                                                                                                  *
*                             ██╗  ██╗ █████╗ ███████╗██████╗  █████╗                              *
*                             ██║ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔══██╗                             *
*                             █████╔╝ ███████║█████╗  ██████╔╝███████║                             *
*                             ██╔═██╗ ██╔══██║██╔══╝  ██╔══██╗██╔══██║                             *
*                             ██║  ██╗██║  ██║██║     ██║  ██║██║  ██║                             *
*                             ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝                             *
*                                                                                                  *
*       ███╗   ███╗ ██████╗ ██████╗ ███████╗██████╗  █████╗ ██████╗  ██████╗ ██████╗  █████╗       *
*       ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔══██╗      *
*       ██╔████╔██║██║   ██║██║  ██║█████╗  ██████╔╝███████║██║  ██║██║   ██║██████╔╝███████║      *
*       ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██╔══██╗██╔══██║██║  ██║██║   ██║██╔══██╗██╔══██║      *
*       ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗██║  ██║██║  ██║██████╔╝╚██████╔╝██║  ██║██║  ██║      *
*       ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝      *
*                                                                                                  *
****************************************************************************************************/

// Inicialização de bibliotecas                                 (∩｀-´)⊃━☆ﾟ.*･｡ﾟ
let   bib_requisicao      =   require('request')
     ,bib_underline       =   require('underscore')
     ;
// Inicialização de bibliotecas                                 (∩｀-´)⊃━☆ﾟ.*･｡ﾟ

class ragnaplace
{
    constructor(p_obj_msg, p_config, p_mensagem, p_cliente)
    {
        this.obj_resposta       =   p_obj_msg;
        this.obj_config         =   p_config;
        this.obj_mensagem       =   p_mensagem;
        this.obj_cliente        =   p_cliente;

    } // constructor(p_obj_msg, p_config, p_mensagem, p_cliente)

    monta_resposta(p_frase, p_mensagem)
    {
        // Monitora qualquer evento de erro para se executar o cliente
        try
        {
            this.obj_mensagem.channel.send(
                                            p_frase
                                           ,p_mensagem
                                        );
        } // try { ... }
        catch(p_erro)
        {
            
            // Imprime o objeto de erro recebido
            console.log('------------------------');
            console.log(p_erro);
            console.log('------------------------');
            // Monitora qual procedimento gerou o erro
            console.log('------------------------');
            console.trace();
            console.log('------------------------');
        } // catch(p_erro) { ... }

    } // monta_resposta(p_cliente, p_mensagem, p_frase, p_configuracao)



    trata_consulta(p_array_frase)
    {
        var v_string_requisicao = '';

        for(var i=1;i<p_array_frase.length;i++)
        {
            // Forma a string
            v_string_requisicao = v_string_requisicao + p_array_frase[i] + ' ';
        } // for(var i=1;i<=p_array_frase.length;i++)

        return v_string_requisicao.trim();
    } // trata_consulta(p_array_frase)



    nova_consulta(p_array_frase)
    {
        var v_termo_consulta = null;

        for(var i=1;i<p_array_frase.length;i++)
        {
            if(p_array_frase[i].trim() !== '' || p_array_frase[i].trim() !== null || p_array_frase[i].trim() !== 'undefined')
            {
                v_termo_consulta = p_array_frase[i].trim();
            } // if(p_array_frase[i].trim() !== '' || p_array_frase[i].trim() !== null || p_array_frase[i].trim() !== 'undefined')
        } // for(var i=1;i<p_array_frase.length;i++)

        return v_termo_consulta;
    } // nova_consulta(p_array_frase)


    item(p_consulta)
    {
        let     v_consulta          =       this.trata_consulta(p_consulta)
               ,v_termo_consulta    =       encodeURI(v_consulta.trim())
               ,v_url_consulta      =       `https://pt.ragnaplace.com/api/${process.env.BOT_TOKEN_RAGNAPLACE}/8/bro/item/search/99/views/${v_termo_consulta}`
               ,v_obj_resposta      =       {}
               ,v_array_resp        =       []
               ,v_contador          =       0
               ,v_resposta
               ,v_pagina
               ;


        try
        {
            bib_requisicao.get(v_url_consulta, (p_erro, p_resposta, p_corpo) =>
            {
                // Atribui ao corpo da consulta a informação
                v_resposta  =   JSON.parse(p_corpo);

                // Verifica se foi possível encontrar algum resultado para a busca desejada
                if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')
                {
                    // Marca uma nova consulta com o termo desejado
                    v_termo_consulta    =   encodeURI(this.nova_consulta(p_consulta));
                    v_url_consulta      =   `https://pt.ragnaplace.com/api/${process.env.BOT_TOKEN_RAGNAPLACE}/8/bro/item/search/99/views/${v_termo_consulta}`;

                    bib_requisicao.get(v_url_consulta, (p_erro_nt, p_resposta_nt, p_corpo_nt) =>
                    {
                        v_resposta  =   JSON.parse(p_corpo_nt);

                        if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')
                        {
                            v_obj_resposta          =   {
                                                            'embed' :   {
                                                                            color               :   this.obj_config.cor_vermelha.color
                                                                           ,author              :   {
                                                                                                        name        :   'Kafra Moderadora'
                                                                                                       ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                       ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                                    }
                                                                           ,title               :   'O QUE É ISSO MEUS AMORES?'
                                                                           ,url                 :   null
                                                                           ,description         :   'Você pesquisou um item que eu não conheço.'
                                                                           ,'image'             :   {
                                                                                                        "url"       :   null
                                                                                                       ,"height"    :   null // 123
                                                                                                       ,"width"     :   null // 123
                                                                                                    }
                                                                           ,thumbnail           :   {
                                                                                                        "url"       :   'https://i.imgur.com/t3E6tKA.gif' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                       ,"height"    :   null // 123
                                                                                                       ,"width"     :   null // 123 
                                                                                                    }
                                                                           ,video               :   {
                                                                                                        "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                       ,"height"    :   null // 123
                                                                                                       ,"width"     :   null // 123
                                                                                                    }
                                                                           ,fields              :   [
                                                                                                        {
                                                                                                            name: 'PESSOA NÃO VAI ACREDITAR'
                                                                                                           ,value: 'QUE CAQUINHA, o termo "' + this.trata_consulta(p_consulta) + '" procurado não foi encontrado em minha base de dados! Perdoa o vacilo e não desiste de mim!'
                                                                                                        }
                                                                                                    ]
                                                                          ,timestamp            :   new Date()
                                                                          ,footer               :   {
                                                                                                        icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                       ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                                    }
                                                                        }
                                                        };


                            this.monta_resposta('CAQUINHAS ME MORDAM <@' + this.obj_mensagem.author.id + '>, não achei nada!'
                                              ,v_obj_resposta
                                              );
                            return;
                        }

                        // Zera o contador
                        v_contador = 0;

                        // Abre os resultados na nova requisição
                        v_resposta.forEach((p_resp) =>
                        {
                            // Incrementa o contador
                            v_contador++;

                            if(v_contador <= 10)
                            {
                                var tmp_coisas = {name: p_resp.text, value: p_resp.link};
                                v_array_resp.push(tmp_coisas);
                            } // if(v_contador <= 10)
                        }); // v_resposta.forEach((p_resp) =>


                        v_obj_resposta          =   {
                                                        'embed' :   {
                                                                        color               :   this.obj_config.cor_amarela.color
                                                                       ,author              :   {
                                                                                                    name        :   'Kafra Moderadora'
                                                                                                   ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                   ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                                }
                                                                       ,title               :   '**QUE ITEM FOI ESSE(8)**'
                                                                       ,url                 :   null
                                                                       ,description         :   'Mas claro que não lhe deixarei no escuro ' + this.obj_mensagem.author.username + '! \n Eis algumas semelhantes ao que você pesquisou.'
                                                                       ,'image'             :   {
                                                                                                    "url"       :   null
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123
                                                                                                }
                                                                       ,thumbnail           :   {
                                                                                                    "url"       :   'https://i.imgur.com/5SiWZwF.png' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123 
                                                                                                }
                                                                       ,video               :   {
                                                                                                    "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123
                                                                                                }
                                                                       ,fields              :   v_array_resp
                                                                       ,timestamp           :   new Date()
                                                                       ,footer              :   {
                                                                                                    icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                   ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                                }
                                                                    }
                                                    };


                        this.monta_resposta('<@' + this.obj_mensagem.author.id + '> me perdoe meu querido, mas só pude encontrar isto.'
                                          ,v_obj_resposta
                                          );
                        return;

                    }); // bib_requisicao.get(v_url_consulta, (p_erro_nt, p_resposta_nt, p_corpo_nt) =>

                } // if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')
                else
                {
                    v_resposta.forEach((p_resp) =>
                    {
                        if(p_resp.id.split('/')[0] == this.input) v_bol_result = p_resp;
                    });

                    v_resposta.forEach((json_resp) =>
                    {
                        // Teste - Consulta similar
                        if(json_resp.name.toLowerCase() == v_consulta.trim().toLowerCase())
                        {
                            // Caso encontre: A página desejada se faz presente.
                            v_pagina    =   json_resp;
                        } // if(json_resp.title.toLowerCase() == v_consulta.trim().toLowerCase())
                    });

                    // Verifica se a página informada foi definida, caso não seja utiliza a primeira opção obtida na query
                    if(typeof v_pagina === 'undefined')
                    {
                        v_pagina        =   bib_underline.first(v_resposta);
                    } // if(typeof v_pagina === 'undefined')

                    // Se mesmo assim a página permanecer não definida
                    if(typeof v_pagina === 'undefined')
                    {
                        v_obj_resposta          =   {
                                                        'embed' :   {
                                                                        color               :   this.obj_config.cor_vermelha.color
                                                                       ,author              :   {
                                                                                                    name        :   'Kafra Moderadora'
                                                                                                   ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                   ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                                }
                                                                       ,title               :   'O QUE É ISSO MEUS AMORES?'
                                                                       ,url                 :   null
                                                                       ,description         :   'Você pesquisou um item que eu não conheço.'
                                                                       ,'image'             :   {
                                                                                                    "url"       :   null
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123
                                                                                                }
                                                                       ,thumbnail           :   {
                                                                                                    "url"       :   'https://i.imgur.com/t3E6tKA.gif' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123 
                                                                                                }
                                                                       ,video               :   {
                                                                                                    "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123
                                                                                                }
                                                                       ,fields              :   [
                                                                                                    {
                                                                                                        name: 'PESSOA NÃO VAI ACREDITAR'
                                                                                                       ,value: 'QUE CAQUINHA, o termo "' + this.trata_consulta(p_consulta) + '" procurado não foi encontrado em minha base de dados! Perdoa o vacilo e não desiste de mim!'
                                                                                                    }
                                                                                                ]
                                                                      ,timestamp            :   new Date()
                                                                      ,footer               :   {
                                                                                                    icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                   ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                                }
                                                                    }
                                                    };


                        this.monta_resposta('Caramba <@' + this.obj_mensagem.author.id + '>, não consegui encontrar o que você procura!'
                                          ,v_obj_resposta
                                          );
                        return;
                    } // if(typeof v_pagina === 'undefined')


                    this.monta_resposta('YAY encontrei para o termo "' +  v_pagina.name + '" a seguinte informação <@' + this.obj_mensagem.author.id + '> (∩｀-´)⊃━☆ﾟ.*･｡ﾟ \n' +  v_pagina.link
                                        ,null
                                        );
                } // else { ... }

                return;
            }); // bib_requisicao.get(v_url_consulta, (p_erro, p_resposta, p_corpo) =>
        } // try { ... }
        catch(p_erro)
        {
            v_obj_resposta          =   {
                                            'embed' :   {
                                                            color               :   this.obj_config.cor_vermelha.color
                                                           ,author              :   {
                                                                                        name        :   'Kafra Moderadora'
                                                                                       ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                       ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                    }
                                                           ,title               :   'Ocorreu um erro durante a pesquisa'
                                                           ,url                 :   null
                                                           ,description         :   'Meus amores, ocorreu um grave erro durante a consulta ao item desejado!'
                                                           ,'image'             :   {
                                                                                        "url"       :   null
                                                                                       ,"height"    :   null // 123
                                                                                       ,"width"     :   null // 123
                                                                                    }
                                                           ,thumbnail           :   {
                                                                                        "url"       :   'https://i.imgur.com/t3E6tKA.gif' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                       ,"height"    :   null // 123
                                                                                       ,"width"     :   null // 123 
                                                                                    }
                                                           ,video               :   {
                                                                                        "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                       ,"height"    :   null // 123
                                                                                       ,"width"     :   null // 123
                                                                                    }
                                                           ,fields              :   [
                                                                                        {
                                                                                            name: 'ERRO'
                                                                                           ,value: 'Infelizmente ao consultar sobre "' + v_consulta + '" Um erro foi levantado.'
                                                                                        }
                                                                                    ]
                                                          ,timestamp            :   new Date()
                                                          ,footer               :   {
                                                                                        icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                       ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                    }
                                                        }
                                        };
            console.log(p_erro);
            console.trace();

            this.monta_resposta('Caramba <@' + this.obj_mensagem.author.id + '> SOCORRRRROOOOOOO!!! DEU ERRO!'
                              ,v_obj_resposta
                              );
            return;
        } // catch(p_erro) {...}
    } // item(p_consulta)








    mob(p_consulta)
    {
        let     v_consulta          =   this.trata_consulta(p_consulta)
               ,v_termo_consulta    =   encodeURI(v_consulta.trim())
               ,v_url_consulta      =   `https://pt.ragnaplace.com/api/${process.env.BOT_TOKEN_RAGNAPLACE}/8/bro/mob/search/99/views/${v_termo_consulta}`
               ,v_obj_resposta      =       {}
               ,v_array_resp        =       []
               ,v_contador          =       0
               ,v_resposta
               ,v_pagina
               ;


        try
        {
            bib_requisicao.get(v_url_consulta, (p_erro, p_resposta, p_corpo) =>
            {
                // Atribui ao corpo da consulta a informação
                v_resposta  =   JSON.parse(p_corpo);

                // Verifica se foi possível encontrar algum resultado para a busca desejada
                if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')
                {
                    // Marca uma nova consulta com o termo desejado
                    v_termo_consulta    =   encodeURI(this.nova_consulta(p_consulta));
                    v_url_consulta      =   `https://pt.ragnaplace.com/api/${process.env.BOT_TOKEN_RAGNAPLACE}/8/bro/item/search/99/views/${v_termo_consulta}`;

                    bib_requisicao.get(v_url_consulta, (p_erro_nt, p_resposta_nt, p_corpo_nt) =>
                    {
                        v_resposta  =   JSON.parse(p_corpo_nt);

                        if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')
                        {
                            v_obj_resposta          =   {
                                                            'embed' :   {
                                                                            color               :   this.obj_config.cor_vermelha.color
                                                                           ,author              :   {
                                                                                                        name        :   'Kafra Moderadora'
                                                                                                       ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                       ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                                    }
                                                                           ,title               :   'O QUE É ISSO MEUS AMORES?'
                                                                           ,url                 :   null
                                                                           ,description         :   'Que monstro é esse que nunca viu meu Banhammer?'
                                                                           ,'image'             :   {
                                                                                                        "url"       :   null
                                                                                                       ,"height"    :   null // 123
                                                                                                       ,"width"     :   null // 123
                                                                                                    }
                                                                           ,thumbnail           :   {
                                                                                                        "url"       :   'https://i.imgur.com/t3E6tKA.gif' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                       ,"height"    :   null // 123
                                                                                                       ,"width"     :   null // 123 
                                                                                                    }
                                                                           ,video               :   {
                                                                                                        "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                       ,"height"    :   null // 123
                                                                                                       ,"width"     :   null // 123
                                                                                                    }
                                                                           ,fields              :   [
                                                                                                        {
                                                                                                            name: 'Sei que é meio embaraçoso o que irei dizer mas ...'
                                                                                                           ,value: 'QUE CAQUINHA, o termo "' + this.trata_consulta(p_consulta) + '" procurado não foi encontrado em minha base de dados! Perdoa o vacilo e não desiste de mim!'
                                                                                                        }
                                                                                                    ]
                                                                          ,timestamp            :   new Date()
                                                                          ,footer               :   {
                                                                                                        icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                       ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                                    }
                                                                        }
                                                        };


                            this.monta_resposta('CAQUINHAS ME MORDAM <@' + this.obj_mensagem.author.id + '>, não achei nada!'
                                              ,v_obj_resposta
                                              );
                            return;
                        } // if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')

                        // Zera o contador
                        v_contador = 0;

                        // Abre os resultados na nova requisição
                        v_resposta.forEach((p_resp) =>
                        {
                            // Incrementa o contador
                            v_contador++;

                            if(v_contador <= 10)
                            {
                                var tmp_coisas = {name: p_resp.text, value: p_resp.link};
                                v_array_resp.push(tmp_coisas);
                            } // if(v_contador <= 10)
                        }); // v_resposta.forEach((p_resp) =>


                        v_obj_resposta          =   {
                                                        'embed' :   {
                                                                        color               :   this.obj_config.cor_amarela.color
                                                                       ,author              :   {
                                                                                                    name        :   'Kafra Moderadora'
                                                                                                   ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                   ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                                }
                                                                       ,title               :   '**Não pude encontrar o monstro que pediu**'
                                                                       ,url                 :   null
                                                                       ,description         :   '***Banhammer*** olha o monstro que não saiu da jaula ' + this.obj_mensagem.author.username + '! \n Já tentou estes abaixo?'
                                                                       ,'image'             :   {
                                                                                                    "url"       :   null
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123
                                                                                                }
                                                                       ,thumbnail           :   {
                                                                                                    "url"       :   'https://i.imgur.com/5SiWZwF.png' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123 
                                                                                                }
                                                                       ,video               :   {
                                                                                                    "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123
                                                                                                }
                                                                       ,fields              :   v_array_resp
                                                                       ,timestamp           :   new Date()
                                                                       ,footer              :   {
                                                                                                    icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                   ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                                }
                                                                    }
                                                    };


                        this.monta_resposta('<@' + this.obj_mensagem.author.id + '> me perdoe meu querido, mas só pude encontrar isto.'
                                          ,v_obj_resposta
                                          );
                        return;

                    }); // bib_requisicao.get(v_url_consulta, (p_erro_nt, p_resposta_nt, p_corpo_nt) =>

                } // if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')
                else
                {
                    v_resposta.forEach((p_resp) =>
                    {
                        if(p_resp.id.split('/')[0] == this.input) v_bol_result = p_resp;
                    });

                    v_resposta.forEach((json_resp) =>
                    {
                        // Teste - Consulta similar
                        if(json_resp.name.toLowerCase() == v_consulta.trim().toLowerCase())
                        {
                            // Caso encontre: A página desejada se faz presente.
                            v_pagina    =   json_resp;
                        } // if(json_resp.title.toLowerCase() == v_consulta.trim().toLowerCase())
                    });

                    // Verifica se a página informada foi definida, caso não seja utiliza a primeira opção obtida na query
                    if(typeof v_pagina === 'undefined')
                    {
                        v_pagina        =   bib_underline.first(v_resposta);
                    } // if(typeof v_pagina === 'undefined')

                    // Se mesmo assim a página permanecer não definida
                    if(typeof v_pagina === 'undefined')
                    {
                        v_obj_resposta          =   {
                                                        'embed' :   {
                                                                        color               :   this.obj_config.cor_vermelha.color
                                                                       ,author              :   {
                                                                                                    name        :   'Kafra Moderadora'
                                                                                                   ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                   ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                                }
                                                                       ,title               :   'Não encontrei!'
                                                                       ,url                 :   null
                                                                       ,description         :   'O monstro que você pesquisou não consta na minha base de dados.'
                                                                       ,'image'             :   {
                                                                                                    "url"       :   null
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123
                                                                                                }
                                                                       ,thumbnail           :   {
                                                                                                    "url"       :   'https://i.imgur.com/t3E6tKA.gif' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123 
                                                                                                }
                                                                       ,video               :   {
                                                                                                    "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                                   ,"height"    :   null // 123
                                                                                                   ,"width"     :   null // 123
                                                                                                }
                                                                       ,fields              :   [
                                                                                                    {
                                                                                                        name: 'PESSOA NÃO VAI ACREDITAR'
                                                                                                       ,value: 'QUE CAQUINHA, o termo "' + v_consulta + '" procurado não foi encontrado em minha base de dados! Perdoa o vacilo e não desiste de mim!'
                                                                                                    }
                                                                                                ]
                                                                      ,timestamp            :   new Date()
                                                                      ,footer               :   {
                                                                                                    icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                                   ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                                }
                                                                    }
                                                    };


                        this.monta_resposta('Caramba <@' + this.obj_mensagem.author.id + '>, não consegui encontrar o que você procura!'
                                          ,v_obj_resposta
                                          );
                        return;
                    } // if(typeof v_pagina === 'undefined')

                    this.monta_resposta('YAY encontrei para o termo "' +  v_pagina.name + '" a seguinte informação <@' + this.obj_mensagem.author.id + '> (∩｀-´)⊃━☆ﾟ.*･｡ﾟ \n' +  v_pagina.link
                                        ,null
                                        );
                    return;
                } // else { ... }
            }); // bib_requisicao.get(v_url_consulta, (p_erro, p_resposta, p_corpo) =>
        } // try { ... }
        catch(p_erro)
        {
            v_obj_resposta          =   {
                                            'embed' :   {
                                                            color               :   this.obj_config.cor_vermelha.color
                                                           ,author              :   {
                                                                                        name        :   'Kafra Moderadora'
                                                                                       ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                       ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                    }
                                                           ,title               :   'Ocorreu um erro durante a pesquisa'
                                                           ,url                 :   null
                                                           ,description         :   'Meus amores, ocorreu um grave erro durante a consulta ao monstro desejado!'
                                                           ,'image'             :   {
                                                                                        "url"       :   null
                                                                                       ,"height"    :   null // 123
                                                                                       ,"width"     :   null // 123
                                                                                    }
                                                           ,thumbnail           :   {
                                                                                        "url"       :   'https://i.imgur.com/t3E6tKA.gif' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                       ,"height"    :   null // 123
                                                                                       ,"width"     :   null // 123 
                                                                                    }
                                                           ,video               :   {
                                                                                        "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                       ,"height"    :   null // 123
                                                                                       ,"width"     :   null // 123
                                                                                    }
                                                           ,fields              :   [
                                                                                        {
                                                                                            name: 'ERRO'
                                                                                           ,value: 'Infelizmente ao consultar sobre "' + v_consulta + '" Um erro foi levantado.'
                                                                                        }
                                                                                    ]
                                                          ,timestamp            :   new Date()
                                                          ,footer               :   {
                                                                                        icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                       ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                    }
                                                        }
                                        };


            this.monta_resposta('Caramba <@' + this.obj_mensagem.author.id + '> SOCORRRRROOOOOOO!!! DEU ERRO!'
                              ,v_obj_resposta
                              );
            return;
        } // catch(p_erro) {...}
    } // mob(p_consulta)



    mapa(p_consulta)
    {
        let     v_consulta          =   this.trata_consulta(p_consulta)
               ,v_termo_consulta    =   encodeURI(v_consulta.trim())
               ,v_url_consulta      =   `https://pt.ragnaplace.com/api/${process.env.BOT_TOKEN_RAGNAPLACE}/8/bro/map/search/99/views/${v_termo_consulta}`
               ,v_obj_resposta      =   {}
               ,v_resposta
               ,v_pagina
               ;


        try
        {
            bib_requisicao.get(v_url_consulta, (p_erro, p_resposta, p_corpo) =>
            {
                // Atribui ao corpo da consulta a informação
                v_resposta  =   JSON.parse(p_corpo);

                // Verifica se foi possível encontrar algum resultado para a busca desejada
                if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')
                {
                    // Caso seja nulo, expõe uma lista com opções extras, com a primeira palavra consultada
                    v_consulta          =   this.nova_consulta(p_consulta);
                    // Se mesmo assim nada for encontrado
                    if(v_consulta.trim() === null || v_consulta.trim() === 'undefined')
                    {
                        v_obj_resposta          =   {
                                                    'embed' :   {
                                                                    color               :   this.obj_config.cor_vermelha.color
                                                                   ,author              :   {
                                                                                                name        :   'Kafra Moderadora'
                                                                                               ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                               ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                            }
                                                                   ,title               :   'ESTOU PERDIDA!'
                                                                   ,url                 :   null
                                                                   ,description         :   'Aonde estou? Que lugar é esse? Quem são vocês? Cadê meu GPS?!'
                                                                   ,'image'             :   {
                                                                                                "url"       :   null
                                                                                               ,"height"    :   null // 123
                                                                                               ,"width"     :   null // 123
                                                                                            }
                                                                   ,thumbnail           :   {
                                                                                                "url"       :   'https://i.imgur.com/t3E6tKA.gif' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                               ,"height"    :   null // 123
                                                                                               ,"width"     :   null // 123 
                                                                                            }
                                                                   ,video               :   {
                                                                                                "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                               ,"height"    :   null // 123
                                                                                               ,"width"     :   null // 123
                                                                                            }
                                                                   ,fields              :   [
                                                                                                {
                                                                                                    name    : 'ESTOU PERDIDA!'
                                                                                                   ,value   : 'A consulta para "' + v_consulta + '" me deixou mais confusa que GPS em rotatória.'
                                                                                                }
                                                                                            ]
                                                                  ,timestamp            :   new Date()
                                                                  ,footer               :   {
                                                                                                icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                               ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                            }
                                                                }
                                                };


                    this.monta_resposta('Caramba <@' + this.obj_mensagem.author.id + '>, não consegui encontrar o que você procura!'
                                      ,v_obj_resposta
                                      );
                        return;
                    } // if(v_consulta.trim() === null || v_consulta.trim() === 'undefined')

                    v_termo_consulta    =   encodeURI(v_consulta.trim());

                    bib_requisicao.get(v_url_consulta, (p_erro_null, p_resposta_null, p_corpo_null) =>
                    {
                        v_resposta  = JSON.parse(p_corpo_null);
                    });
                } // if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')

                if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')
                {
                    v_obj_resposta          =   {
                                                    'embed' :   {
                                                                    color               :   this.obj_config.cor_vermelha.color
                                                                   ,author              :   {
                                                                                                name        :   'Kafra Moderadora'
                                                                                               ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                               ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                            }
                                                                   ,title               :   'ESTOU PERDIDA!'
                                                                   ,url                 :   null
                                                                   ,description         :   'Aonde estou? Que lugar é esse? Quem são vocês? Cadê meu GPS?!'
                                                                   ,'image'             :   {
                                                                                                "url"       :   null
                                                                                               ,"height"    :   null // 123
                                                                                               ,"width"     :   null // 123
                                                                                            }
                                                                   ,thumbnail           :   {
                                                                                                "url"       :   'https://i.imgur.com/t3E6tKA.gif' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                               ,"height"    :   null // 123
                                                                                               ,"width"     :   null // 123 
                                                                                            }
                                                                   ,video               :   {
                                                                                                "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                               ,"height"    :   null // 123
                                                                                               ,"width"     :   null // 123
                                                                                            }
                                                                   ,fields              :   [
                                                                                                {
                                                                                                    name    : 'ESTOU PERDIDA!'
                                                                                                   ,value   : 'A consulta para "' + v_consulta + '" me deixou mais confusa que GPS em rotatória.'
                                                                                                }
                                                                                            ]
                                                                  ,timestamp            :   new Date()
                                                                  ,footer               :   {
                                                                                                icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                               ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                            }
                                                                }
                                                };


                    this.monta_resposta('Caramba <@' + this.obj_mensagem.author.id + '>, não consegui encontrar o que você procura!'
                                      ,v_obj_resposta
                                      );
                    return;
                } // if(v_resposta === 'null' || v_resposta === 'NULL' || v_resposta === null || v_resposta === 'undefined')

                v_resposta.forEach((p_resp) =>
                {
                    if(p_resp.id.split('/')[0] == this.input) v_bol_result = p_resp;
                });

                v_resposta.forEach((json_resp) =>
                {
                    // Teste - Consulta similar
                    if(json_resp.name.toLowerCase() == v_consulta.trim().toLowerCase())
                    {
                        // Caso encontre: A página desejada se faz presente.
                        v_pagina    =   json_resp;
                    } // if(json_resp.title.toLowerCase() == v_consulta.trim().toLowerCase())
                });

                // Verifica se a página informada foi definida, caso não seja utiliza a primeira opção obtida na query
                if(typeof v_pagina === 'undefined')
                {
                    v_pagina        =   bib_underline.first(v_resposta);
                } // if(typeof v_pagina === 'undefined')

                // Se mesmo assim a página permanecer não definida
                if(typeof v_pagina === 'undefined')
                {
                    v_obj_resposta          =   {
                                                    'embed' :   {
                                                                    color               :   this.obj_config.cor_vermelha.color
                                                                   ,author              :   {
                                                                                                name        :   'Kafra Moderadora'
                                                                                               ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                               ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                            }
                                                                   ,title               :   'ESTOU PERDIDA!'
                                                                   ,url                 :   null
                                                                   ,description         :   'Aonde estou? Que lugar é esse? Quem são vocês? Cadê meu GPS?!'
                                                                   ,'image'             :   {
                                                                                                "url"       :   null
                                                                                               ,"height"    :   null // 123
                                                                                               ,"width"     :   null // 123
                                                                                            }
                                                                   ,thumbnail           :   {
                                                                                                "url"       :   'https://i.imgur.com/t3E6tKA.gif' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                               ,"height"    :   null // 123
                                                                                               ,"width"     :   null // 123 
                                                                                            }
                                                                   ,video               :   {
                                                                                                "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                               ,"height"    :   null // 123
                                                                                               ,"width"     :   null // 123
                                                                                            }
                                                                   ,fields              :   [
                                                                                                {
                                                                                                    name    : 'ESTOU PERDIDA!'
                                                                                                   ,value   : 'A consulta para "' + v_consulta + '" me deixou mais confusa que GPS em rotatória.'
                                                                                                }
                                                                                            ]
                                                                  ,timestamp            :   new Date()
                                                                  ,footer               :   {
                                                                                                icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                               ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                            }
                                                                }
                                                };


                    this.monta_resposta('Caramba <@' + this.obj_mensagem.author.id + '>, não consegui encontrar o que você procura!'
                                      ,v_obj_resposta
                                      );
                    return;
                } // if(typeof v_pagina === 'undefined')

                this.monta_resposta('YAY encontrei para o termo "' +  v_pagina.name + '" a seguinte informação <@' + this.obj_mensagem.author.id + '> (∩｀-´)⊃━☆ﾟ.*･｡ﾟ \n' +  v_pagina.link
                                    ,null
                                    );
                return;
            }); // bib_requisicao.get(v_url_consulta, (p_erro, p_resposta, p_corpo) =>
        } // try { ... }
        catch(p_erro)
        {
            v_obj_resposta          =   {
                                            'embed' :   {
                                                            color               :   this.obj_config.cor_vermelha.color
                                                           ,author              :   {
                                                                                        name        :   'Kafra Moderadora'
                                                                                       ,icone       :   'https://i.imgur.com/cfYwkLQ.png'
                                                                                       ,url         :   'https://github.com/bropedia/Kafra-Moderadora'
                                                                                    }
                                                           ,title               :   'Ocorreu um erro durante a pesquisa'
                                                           ,url                 :   null
                                                           ,description         :   'Meus amores, ocorreu um grave erro durante a consulta ao mapa desejado!'
                                                           ,'image'             :   {
                                                                                        "url"       :   null
                                                                                       ,"height"    :   null // 123
                                                                                       ,"width"     :   null // 123
                                                                                    }
                                                           ,thumbnail           :   {
                                                                                        "url"       :   'https://i.imgur.com/t3E6tKA.gif' // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                       ,"height"    :   null // 123
                                                                                       ,"width"     :   null // 123 
                                                                                    }
                                                           ,video               :   {
                                                                                        "url"       :   null // 'https://i.imgur.com/LOGICNS.jpg'
                                                                                       ,"height"    :   null // 123
                                                                                       ,"width"     :   null // 123
                                                                                    }
                                                           ,fields              :   [
                                                                                        {
                                                                                            name: 'ERRO'
                                                                                           ,value: 'Infelizmente ao consultar sobre "' + v_consulta + '" Um erro foi levantado.'
                                                                                        }
                                                                                    ]
                                                          ,timestamp            :   new Date()
                                                          ,footer               :   {
                                                                                        icon_url:   'https://i.imgur.com/cfYwkLQ.png'
                                                                                       ,text:       '© bROPédia - Por MBrauna e Lazarento'
                                                                                    }
                                                        }
                                        };


            this.monta_resposta('Caramba <@' + this.obj_mensagem.author.id + '>, não consegui encontrar o que você procura!'
                              ,v_obj_resposta
                              );
            return;
        } // catch(p_erro) {...}
    } // mapa(p_consulta)

} // class ragnaplace



// Torna o método público
module.exports = ragnaplace;
