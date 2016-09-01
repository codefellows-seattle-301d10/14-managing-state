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

  // COMMENT: This method populates the author and categories drop down menus with the value of the authors and catgeories properties of each object in our hackerIpsum.json file (via the table created in our article.js model). The map function cycles through each of those article objects, and returns the value of the author and category properties of those objects. It then appends those values to the template using the handlebars compile method. It's essentially abstracting the options and the values and appending them to a specific handlebars template (#author-filter and #category-filter). The allCategories method is a little different. Although the allAuthors and allCategories methods in article.js are both selecting for distinct author and category names, they do so in different ways. In our allAuthors method, we capture distinct values using jQuery (as an example of a synchronous, functional programming approach to getting unique data), while we use a SQL DISTINCT call to filter our categories. Here, we use two different methods of compiling and rendering our authors and categories, too.
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

  // COMMENT: This method keeps you from selecting both an author filter and a category filter, or multiple author or category filters at the same time, in your drop down menus. It captures the filters id, the section containing the author-filter and category-filter html elements, and applies the one method. The one method attaches a handler to an event for each element, that will only execute once per event parameter. Here, we are attaching a function on change or selection of the filters id. This function replaces the id of the #category-filter with a #category + empty string id, and saves it as a resource variable, which page.js uses to populate the url, and replace any whitespace with a plus sign (like between author name, for example). It then looks to the cousin elements of whatever filter was selected, and replaces its ID with an empty string. This is essentially a query, just without the ?

  articleView.handleFilters = function() {
    $('#filters').one('change', 'select', function() {
      var resource = this.id.replace('-filter', '');
      $(this).parent().siblings().children().val('');
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

  // COMMENT: This method renders the index.html page, by showing the articles section (using the articles id) while hiding that section's siblings (the about section and blog-stats section). When we click on read on, the url changes and the state of the data is changed, such that all article instances are removed, except for the one we clicked on, which is rendered. The functions populateFilters and handleFilters are also called, and each article is truncated. 

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
