(function(module) {
  var articleController = {};

  Article.createTable();

  articleController.index = function(ctx, next) {
    if(ctx.articles.length) {
      articleView.index(ctx.articles);
    } else{
      page('/');
    }
  };

  // COMMENT: DONE What does this method do?  What is it's execution path?
  //This function grabs an article name based on what the current ID is, and we passed that on to the next function. This method creates a function that sets ctx (context) equal to the article name, and then uses that as a callback function within Article.findWhere().Article.findWhere() selects the data from the SQL database table "articles."

  //Execution Path
  //1. First, Article.findWhere(); is called.
  //2. Article.findWhere(); calls the function known as articleData.
  //3. articleData sets the context based on the SQL selection.
  //4. The last thing is that next(); will get executed.

  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: DONE What does this method do?  What is it's execution path?

  //This function grabs an article or articles based off the author name. It creates a function that sets the context equal to an array of all the articles according to the author name. It is then used as a callback function within Article.findwhere();. Article.findWhere() selects the data from the SQL database table "articles."


  //Execution Path
  //1. First, Article.findWhere(); is called.
  //2. Article.findWhere(); calls the function known as authorData.
  //3. The replace() method is called on the author name in order to clean it up.
  //4. authorData sets the context based on the SQL selection.
  //5. The last thing is that next(); will get executed.

  articleController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere(
      'author', ctx.params.authorName.replace('+', ' '), authorData
    );
  };

  // COMMENT: DONE What does this method do?  What is it's execution path?
  //This function grabs an article or articles based off their category. It creates a function that sets the context equal to an array of all the articles that match the category. It is then used as a callback function within Article.findwhere();. Article.findWhere() selects the data from the SQL database table "articles."

  //Execution Path
  //1. First, Article.findWhere(); is called.
  //2. Article.findWhere(); calls the function known as categoryData.
  //3. categoryData sets the context based on the SQL selection.
  //4. The last thing is that next(); will get executed.

  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: DONE What does this method do?  What is it's execution path?
  //This function sets the current context to an array of all the articles. It checks to see if we have the data locally, and if not, it invokes the Article.fetchAll(); function in order to get the data.

  //EXECUTION PATH
  //1. We go into the "if/else" statement to check if the data is stored locally.
  //2. If it is stored locally, we set the context, and if not, we invoke Article.fetchALL(); with articleData as a callback function.



  articleController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.allArticles;
      next();
    };

    if (Article.allArticles.length) {
      ctx.articles = Article.allArticles;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };

  module.articleController = articleController;
})(window);
