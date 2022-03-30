const { Pizza } = require('../models');
const { db } = require('../models/Pizza');

const pizzaController = {
    // the functions will go in here as methods
    /* 
        getAllPizza(), will serve as the callback 
        function for the GET /api/pizzas route. It uses 
        the Mongoose .find() method, much like the Sequelize.
        findAll() method
    
    */

    //get all pizzas
    getAllPizza(req, res){
        Pizza.find({})
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //get one pizza by id
        

    /*
        The second method, .getPizzaById(), uses the Mongoose.
        findOne() method to find a single pizza by its _id. 
        Instead of accessing the entire req, we've destructured 
        params out of it, because that's the only data we need 
        for this request to be fulfilled. If we can't find a pizza 
        with that _id, we can check whether the returning value is 
        empty and send a 404 status back to alert users that it doesn't exist.
    */
    getPizzaById({ params }, res ){
        Pizza.findOne({ _id: params.id })
            .then(dbPizzaData => {
                // if no pizza is found, send 404
                if(!dbPizzaData){
                    res.status(404).json({ message: 'No pizza found with this id! '});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },
    // create pizza

    /* 
        With this .createPizza() method, we destructure the body out 
        of the Express.js req object because we don't need to interface
         with any of the other data it provides. Again, just like with 
         Sequelize, in Mongoose we use the method .create() to create data. 
         We send a 400 error back if something goes wrong, as we likely sent 
         the wrong type of data for one of the fields.
    */
    createPizza({ body },res){
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },
    // update pizza by id
    // PUT /api/pizzas/:id
    /* NOTES: There are also Mongoose and MongoDB methods called .updateOne() and .updateMany(), which update documents without returning them. */
    updatePizza({ params, body }, res){

        // If we don't set that third parameter, { new: true }, 
        // it will return the original document. By setting the parameter to true,
        // we're instructing Mongoose to return the new version of the document.
        Pizza.findOneAndUpdate({ _id: params.id }, body, {new: true })
            .then(dbPizzaData => {
                if(!dbPizzaData){
                    res.status(404).json({ message: 'No pizza found with this id! '});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },
    // delete pizza
    // with {params}, we don't have to use res.params. We already destructure it
    /* NOTES: In this example, we use the Mongoose .findOneAndDelete() method, 
    which will find the document to be returned and also delete it from the database. 
    Like with updating, we could alternatively use .deleteOne() or .deleteMany(), 
    but we're using the .findOneAndDelete() method because it provides a little more
     data in case the client wants it.
    */
    deletePizza({ params }, res){
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if(!dbPizzaData){
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }

}

module.exports = pizzaController;