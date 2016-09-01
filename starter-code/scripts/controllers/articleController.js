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

  // COMMENT: What does this method do?  What is it's execution path?

  /* loadById first runs the Article.findWhere function to get our data. We're
  pulling everything from the sql database of articles WHERE id = the id of
  the context (current article) that is being passed in. Then we run
  articleData, which is defined above. articleData attaches the value of the
  Context.article to the value of the placeholder article. Then we run the
  next() function, which is articleController.index, as described by the
   routes.js file.

   This function's execution path is that it runs when page('/article/:id' runs.
  */
  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  /* loadByAuthor first runs the Article.findWhere function to get our data.
   We're pulling everything from the sql database of articles WHERE id = the id
  of the context (current article) that is being passed in. Then we run
  articleData, which is defined above. articleData attaches the value of the
  Context.article to the value of the placeholder article. Then we run the
  next() function, which is articleController.index, as described by the
   routes.js file.

   This function's execution path is that it runs when
   page('/author/:authorName' runs.
  */
  articleController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere(
      'author', ctx.params.authorName.replace('+', ' '), authorData
    );
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
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
