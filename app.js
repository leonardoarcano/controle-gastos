
class Despesa { //criação de uma classe de objetos de despesa
    constructor (ano, mes, dia, tipo, descricao, valor){ // construtor vai receber as informaçõs do formulário e distribuirá entre os "this"
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){

         if(this[i] == undefined || this[i] == '' || this[i] == null){
            return false // se qualquer um dos campos retornar vazio, indefinido ou nulo o valor será falso na criação de uma nova despesa.
         }
        }

        return true //caso contrário, o objeto "despesa" será criado.
    }
}



class Bd{ //classe banco de dados

    constructor(){ //constructor para criar um id, caso ele ainda não exista
        let id = localStorage.getItem('id') 
        
        if(id === null){ //testa se o id existe ou não. Caso ele não se encontre no localStorage é criado um id de númeo 0.
            localStorage.setItem('id', 0)
        }
    
    }

    getProximoId(){ //buscar próximo número de ID 

        let proximoId = localStorage.getItem('id')

        return parseInt(proximoId) + 1 // retorna o ID atual + 1
    }

    gravar(d){//método responsável por armazenar os dados localmente via JSON 
    
    let id = this.getProximoId() //o id recebe o retorno da função "próximoID"

    localStorage.setItem(id, JSON.stringify(d))

    localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        let despesas = Array() //despesas será um array

        let id = localStorage.getItem('id') //id recebe o valor 'id' encontrado no Banco de Dados interno
 
        for(let i = 1; i <= id; i++){ // i recebe um e é comparado com o valor do id, depois é acrecentado ++1 até que termine os IDs.
            let despesa = JSON.parse(localStorage.getItem(i)) //a despesa será o item JSON convertido à objeto

            if (despesa === null){ //se a despesa for deletada ou não existir no ID a aplicação continua antes que suba a despesa para o ARRAY 
                continue
            }

            despesa.id = i

            despesas.push(despesa) //push da "despesa" para o array DESPESAS
        }
        return despesas //retorna o array
    }

    pesquisar(despesa){

        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesasFiltradas)

        if (despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
         }

        if (despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
         }

         if (despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
         }

         if (despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
         }
        
         if (despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
         }

         if (despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
         }

         return despesasFiltradas

    }
    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){ //função que será chamada ao clicar em "ADICIONAR"
   let ano = document.getElementById('ano') //cria variáveis que referenciam as IDs dos elementos preenchidos
   let mes = document.getElementById('mes')
   let dia = document.getElementById('dia')
   let tipo = document.getElementById('tipo')
   let descricao = document.getElementById('descricao')
   let valor = document.getElementById('valor')

   let despesa = new Despesa( //a função dispara a criação de uma nova despesa baseada na classe "Despesa", criada anteriormente
    ano.value, //utilisa as referências criadas anteriormente para recuperar os valores
    mes.value, 
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
   )
    if(despesa.validarDados()){ //se a funcão "validarDados()" retornar "true" um modal será ativo e o registro será feito no armazenamento local.
       document.getElementById('tituloModal').innerHTML = 'Sucesso na Gravação'
       document.getElementById('tituloModal').className = 'text-success'

       document.getElementById('mensagem').innerHTML = 'A despesa foi inserida com sucesso!'

       document.getElementById('botao').innerHTML = 'Voltar'
       document.getElementById('botao').className = 'btn btn-success'

       $('#registraGravacao').modal('show')
       bd.gravar(despesa) //por último ela dispara a função de gravar os dados(no armazenamento local)

        ano.value = ''
        mes.value = '' 
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else { // caso contrário, o modal de erro será mostrado com a mensagem de retornar e corrigir.
        document.getElementById('tituloModal').innerHTML = 'Erro na Gravação'
        document.getElementById('tituloModal').className = 'text-danger'

        document.getElementById('mensagem').innerHTML = 'Algumas informações obrigatórias não foram preenchidas.'

        document.getElementById('botao').innerHTML = 'Voltar e corrigir'
        document.getElementById('botao').className = 'btn btn-danger'
        $('#registraGravacao').modal('show')
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false){ //ao carregar a página de consulta, essa função será disparada automáticamente.


    if(despesas.length == 0 && filtro == false){
        despesas =  bd.recuperarTodosRegistros()
    } else
    if(despesas.length == 0 && filtro == true){
       document.getElementById('mensagem').innerHTML = 'Nada para Exibir'
    }
    
    
    let listaDespesas = document.getElementById('listaDespesas') //cria uma variável que irá referenciar o id "listaDespesas", no "tbody" 
    listaDespesas.innerHTML = ''
    despesas.forEach(function(d){ //funcão callback forEach para navegar entre os elementos da tabela
        //criando a linha (tr)
        let linha = listaDespesas.insertRow() 

        //criando as colunas (td)

        linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`
        
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
            }
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa (ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}
