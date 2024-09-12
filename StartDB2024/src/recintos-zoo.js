//construtor da classe Animal
class Animal {
    constructor(animal, tamanho, biomas, classificacao) {
        this.animal = animal;
        this.tamanho = tamanho;
        this.biomas = biomas;
        this.classificacao = classificacao;
    }
}


//construtor da classe Recinto
class Recinto{
    constructor(id, bioma, tamanhoTotal, animaisExistentes = []) {
        this.id = id;
        this.bioma = bioma;
        this.tamanhoTotal = tamanhoTotal;
        this.animaisExistentes = animaisExistentes;
    
    }
   

}

// Classe RecintosZoo que organiza os recintos e os animais disponíveis no zoológico
class RecintosZoo {

    constructor() {
        //inicialização dos recintos existentes no zoológico
        this.recintos = [
            new Recinto(1, 'savana', 10, [{ especie: 'MACACO', quantidade: 3 }]),
            new Recinto(2, 'floresta', 5, []),
            new Recinto(3, 'savana e rio', 7, [{ especie: 'GAZELA', quantidade: 1 }]),
            new Recinto(4, 'rio', 8, []),
            new Recinto(5, 'savana', 9, [{ especie: 'LEAO', quantidade: 1 }])
        ];

        //inicialização dos animais permitidos no zoológico
        this.animaisPermitidos = [
            new Animal('LEAO', 3, ['savana'], "carnivoro"),
            new Animal('LEOPARDO', 2, ['savana'], "carnivoro"),
            new Animal('CROCODILO', 3, ['rio'], "carnivoro"),
            new Animal('MACACO', 1, ['savana', 'floresta'], "onivoro"),
            new Animal('GAZELA', 2, ['savana'], "herbivoro"),
            new Animal('HIPOPOTAMO', 4, ['savana', 'rio'], "herbivoro")
        ];
    }
     
    /*O método analisaRecintos recebe como parâmetros o animal e a quantidade dele e a partir desses dados 
    verifica se há recintos onde estes animais se sintam confortáveis indicando quais são eles*/
    analisaRecintos(animal, quantidade) {

        //percorre o array de objetos this.animaisPermitidos para analisar se o animal recebido como parâmetro é igual a algum animal do array
        let animalPermitido = this.animaisPermitidos.find(a => a.animal === animal);

        /*analisa se não foi encontrado o valor de animalPermitido, ou seja,
         se o animal do parâmetro não é igual a algum animal no array this.animaisPermitidos e assim retorna Animal inválido*/

        if (!animalPermitido) {
            return { erro: "Animal inválido" };
        }
        //analisa se a quantidade fornecida é menor que 1 ou se é um número inteiro e se for true retorna Quantidade inválida
        if (quantidade < 1 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }
        
        //criação do array recintosViaveis
        const recintosViaveis = [];

        //percorrendo os recintos
        this.recintos.forEach(recinto => {

            //Para cada bioma do animalPermitido é verificado se o bioma do recinto (recinto.bioma) inclui esse bioma específico.
            let biomaAdequado = animalPermitido.biomas.some(bioma => recinto.bioma.includes(bioma));
            if (!biomaAdequado) return;
    
            let existeCarnivoro = false;
            let espacoOcupado = 0;
            
            //percorrendo os animais existentes no recinto
            recinto.animaisExistentes.forEach(a => {
   
            /* Percorre o array this.animaisPermitidos para encontrar um objeto cuja propriedade 'animal' seja igual 
   à propriedade 'especie' de um animal presente no array 'animaisExistentes', assim se sabe quais animais já estão no recinto. */

            let especieAnimal = this.animaisPermitidos.find(an => an.animal === a.especie);

            espacoOcupado += a.quantidade * especieAnimal.tamanho;  // Calcula o espaço ocupado pelos animais existentes

            // Verifica se há carnívoros entre os animais no recinto
            if (especieAnimal.classificacao === 'carnivoro') {
                    existeCarnivoro = true;
                }
            });
    
            // Regras específicas para crocodilos, macacos e hipopótamos
            if (animalPermitido.animal === 'CROCODILO' && recinto.bioma !== 'rio') {
                return;
            }
            if(animalPermitido.animal === 'MACACO'){
                let biomaVazio =  recinto.animaisExistentes.length === 0;

                if ((animalPermitido.quantidade < 1 && biomaVazio) || existeCarnivoro === true){
                    return;
                }
               
            }

            if(animalPermitido.animal === 'HIPOPOTAMO'){
                let diferenteHipopotamo = recinto.animaisExistentes.some(a => a.especie !== 'HIPOPOTAMO');
                if(recinto.bioma !== 'savana e rio' && diferenteHipopotamo){
                    return;
                }
                 
            }

        /* Regra para carnívoros: se o animal que se quer adicionar for carnívoro e se também a variável existeCarnivoro for verdadeiro, 
        ou seja, se já existe um animal carnívoro no recinto, a constante mesmaEspecie verifica se já existe um animal da mesma espécie no recinto*/
            if (animalPermitido.classificacao == 'carnivoro' && existeCarnivoro){
                const mesmaEspecie = recinto.animaisExistentes.some(a => a.especie === animal);
                if (!mesmaEspecie) {
                    return;
                }
            } 
    
    
            // Cálculo do espaço necessário
            const espacoExtra = recinto.animaisExistentes.some(a => a.especie !== animal) ? 1 : 0;//Verificação se precisa de espaço extra

            const espacoNecessario = animalPermitido.tamanho * quantidade;  // espacoNecessario para o animal adicionado

            /* Subtrair o espacoOcupado(espaço ocupado pelos animais existentes no início do código),
            espacoExtra e espacoNecessario para o animal adicionado */
           const espacoRestante = recinto.tamanhoTotal - espacoOcupado - espacoExtra - espacoNecessario; 

           /* Verifica se o espaço restante é maior ou igual ao espaço necessário para os novos animais, 
           ou se o espaço restante é exatamente zero. Mesmo que não haja espaço livre adicional (ou seja, o espaço restante é zero),
           o recinto é considerado viável porque o cálculo já descontou o espaço ocupado pelos animais existentes,
           o espaço extra necessário para acomodar várias espécies e o espaço necessário para os novos animais. */
            if (espacoRestante >= espacoNecessario || espacoRestante === 0) {

                //Adiciona um template string com os dados do id, espaço restante e tamanho total do recinto
                recintosViaveis.push(`Recinto ${recinto.id} (espaço livre: ${espacoRestante} total: ${recinto.tamanhoTotal})`);
            }
        });
    
       
        /* Se o array 'recintosViaveis' estiver vazio, ou seja, se nenhum recinto foi considerado viável para adicionar o animal,
         retorna um erro com a mensagem "Não há recinto viável"*/
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }
        return { recintosViaveis };
    }

}

export { RecintosZoo as RecintosZoo };
