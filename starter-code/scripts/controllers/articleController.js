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

  //JOHN: loadById is essentially taking an a variable which will become an
  // Article instance, and then invoking articleController. At which
  // point we are querying the sql data for ids matching the current article
  // id. The execution path is a page call article/:id
  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?

  // JOHN: We're doing the same thing here as above except this time we're
  // essentially removing any +'s. The execution path here is another                 // page call to author/:authorName
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

  // JOHN: This method has the same functionality as the others but it's purose
  // is to load all articles that match the selected category. The execution path
  // here is a page call to category/:categoryName
  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?

  // JOHN: loadAll ques up all articles and then checks to see if any articles
  // have been loaded yet, and if so it renders to the dom and if not, then
  // we run fetchAll to get the data. 
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
