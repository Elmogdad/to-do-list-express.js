
exports.getTasks = async (req, res) => {
    res.render('tasks/index' , {
        pageTitle: 'My Tasks' ,
         path : '/tasks' , 
         errorMessage : 'erro tasks'})
}
