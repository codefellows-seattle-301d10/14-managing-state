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

  // This method also runs callbacks via next() in order to persist state from one use to the next. State is allowed to be persisted via the context object. This method loads a specific article when read more is clicked. The path of that article is /articles/id.  It finds the ID, puts it into the context object's params property, and users articleData to render the article. Then, the next() function is called to move to the next function.

  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // This method is the same as loadById, except it loads specific articles by the author property of the context object, rather than by id. The findWhere function finds the author property on the context object, and replaces any whitespace with a + sign, such that the URL path will be /author/firstname+lastname.
  articleController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere(
      'author', ctx.params.authorName.replace('+', ' '), authorData
    );
  };

  // This method acts in the same way as the previous method, except that it loads the category property of the context object instead of the author property, and the URL file path becomes /category/categoryname.
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
