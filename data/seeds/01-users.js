exports.seed = function(knex){
    return knex('users').del()
        .then(function(){
            return knex('users').insert([
                {username: 'James', password: 'password1'},
                {username: 'Logan', password: 'password2'},
                {username: 'Hanna', password: 'password3'},
            ]);
        });
};