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
   We're pulling everything from the sql database of articles WHERE author =
  the author of the context (current article) that is being passed in. Then we
  run articleData, which is defined above. articleData attaches the value of the
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

  /* loadByCategory first runs the Article.findWhere function to get our data.
  We're pulling everything from the sql database of articles WHERE category =
  the category of the context (current article) that is being passed in. Then
  we run articleData, which is defined above. articleData attaches the value
  of the Context.article to the value of the placeholder article. Then we run
  the next() function, which is articleController.index, as described by the
  routes.js file.

  This function's execution path is that it runs when
  page('/category/:categoryName' runs.
  */
  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?

  /* loadAll runs when we hit our home page. It is used to display all of the
  articles onto the page when you hit the default home page. This is also what
  runs when the website is initially loaded. Because of this, we run an if/else
  check to first see if the data exists and has been pulled into our Article.
  allArticles array or not yet. If it is our first time navigating to the
  home page, it is likely that this data doesn't exist yet. If it does exist,
  then we will run the Article.fetchAll method to go get the data and that will
  run all of the rendering functions next.

   This function's execution path is that it runs when
   page('/author/:authorName' runs.
  */
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
