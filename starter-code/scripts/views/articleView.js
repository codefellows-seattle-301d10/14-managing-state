(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo =
      parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus =
      article.publishedOn ? 'published ' +
      article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  // COMMENT: DONE What does this method do?  What is it's execution path?
  //This function sets up two filters by populating them with two different arays consisting of author names and category names.
  //Category names are pulled in via SQL and appended to the DOM.
  //Author names are pulled in from local data and appended to the DOM.

  //EXECUTION PATH
  //1. We initiate "options" as an empty variable.
  //2. We store a function into a variable called "template" which was returned by the Handlebars.compile() method.
  //3. For every author in the array, the "template" function is run, therefore wrapping each author name in the template script.
  //4. We use jQuery to append the list of authors to the selected element with the ID of "author-filter".
  //5. For every category in the array, the "template" function is run, therefore wrapping each category name in the template script.
  //6. We use jQuery to append the list of categories to the selected element with the ID of "category-filter."


  articleView.populateFilters = function() {
    var options;
    var template = Handlebars.compile($('#option-template').text());
    options = Article.allAuthors()
      .map(function(author) {
        return template({val: author});
      });
    $('#author-filter').append(options);

    Article.allCategories(function(rows) {
      $('#category-filter').append(
        rows.map(function(row) {
          return template({val: row.category});
        })
      );
    });
  };

  // COMMENT: DONE What does this method do?  What is it's execution path?

  //This function makes an event listener on both filters. jQuery selects the element #filters and then adds an event listener onto the "select" tags.

  //The value of the other filter is set to blank.


  //A variable called "resource" stores a string that is either "category" or "author". This is a result of the .replace() method that replaces the "-filter" part of the ID name of "this" with nothing, essentially removing it.

  //A new route is set up using the resource variable and Regex makes it URL compatible. This results in the URL being author/"authorName" or category/"categoryName".

  articleView.handleFilters = function() {
    $('#filters').one('change', 'select', function() {
      $(this).parent().siblings().children().val('');
      var resource = this.id.replace('-filter', '');
      page('/' + resource + '/' +
      // Replace any/all whitespace with a '+' sign
        $(this).val().replace(/\W+/g, '+')
      );
    });
  };
/* articleView.handleAuthorFilter = function() {
     $('#author-filter').on('change', function() {
       if ($(this).val()) {
         $('article').hide();
         $('article[data-author="' + $(this).val() + '"]').fadeIn();
       } else {
         $('article').fadeIn();
         $('article.template').hide();
       }
       $('#category-filter').val('');
     });
   };

   articleView.handleCategoryFilter = function() {
     $('#category-filter').on('change', function() {
       if ($(this).val()) {
         $('article').hide();
         $('article[data-category="' + $(this).val() + '"]').fadeIn();
       } else {
         $('article').fadeIn();
`        $('article.template').hide();
        }
       $('#author-filter').val('');
     });
   };

   DONE: Remove the setTeasers method,
    and replace with a plain ole link in the article template.
   articleView.setTeasers = function() {
     $('.article-body *:nth-of-type(n+2)').hide();

     $('#articles').on('click', 'a.read-on', function(e) {
       e.preventDefault();
       $(this).parent().find('*').fadeIn();
       $(this).hide();
     });
   }; */

  // COMMENT: DONE What does this method do?  What is it's execution path?

  //This function renders the index page and then calls two more functions.

  // EXECUTION PATH
  //1.First the #articles section is shown while its sibling sections are hidden.
  //2. The articles in the #articles section are removed.
  //3. We iterate through each article.
  //4. On each iterated article, we call the render(); function on it and append it to #articles.
  //5. The render(); function renders the full articles. It returns the HTML that gets appended. The render(); function also calculates how long ago the article was published and indicates if it was an unpublished draft.
  //6. articleView.populateFilters(); is invoked.
  //7. articleView.handleFilters(); is invoked.


  articleView.index = function(articles) {
    $('#articles').show().siblings().hide();

    $('#articles article').remove();
    articles.forEach(function(a) {
      $('#articles').append(render(a));
    });

    articleView.populateFilters();
    articleView.handleFilters();

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  module.articleView = articleView;
})(window);
