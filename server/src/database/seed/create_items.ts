import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('items').insert([
        {title: 'Lâmpadas', image: 'lampadas.svg'},
        {title: 'Pilhas e baterias', image: 'baterias.svg'},
        {title: 'Papeis e papelão', image: 'papeis-papelao.svg'},
        {title: 'Residuos Eletrônicos', image: 'eletronicos.svg'},
        {title: 'Residuos orgânicos', image: 'organicos.svg'},
        {title: 'Oleo de cozinha', image: 'oleo.svg'}
    ])

}
