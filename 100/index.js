var $

function decodeEntities (encodedString) {
  var textArea = document.createElement('textarea')
  textArea.innerHTML = encodedString
  return textArea.value
}

$(function () {
  $('#go').click(function (e) {
    console.log('Generating')
    e.preventDefault()

    const url = $('#url').val()

    const postUrl = 'https://public-api.wordpress.com/rest/v1.1/sites/bandofcharacters.wordpress.com/posts?pretty=1&fields=ID,title,slug,URL,content'
    $.getJSON(postUrl)
      .then(function (data) {
        data.posts.forEach(function (post) {
          if (url.indexOf(post.slug) === -1) return;
          console.log(post)

          // Extract title to avoid accidental hashtags
          const title = decodeEntities(post.title.replace('#', 'Thing '))

          // Parse body to extract first image tag
          let imageUrl = $(post.content).find('img').attr('src') || ''
          imageUrl = imageUrl.replace(/\?.+/, '')

          // Facebook
          const fbText = ` #hundredthings\n\n${url}`

          // Twitter
          const twText = `${title} #hundredthings\n\n${post.URL}`

          // Instagram
          const igText = `${title}\n\n#hundredthings (Follow along using the link in my bio!)`

          $('#facebook').val(fbText)
          $('#twitter').val(twText)
          $('#instagram-image-link').attr('href', imageUrl)
          $('#instagram').val(igText)
        })
    })
    $('#facebook,#twitter').focus(function () { $(this).select() })

  })

  const allPostsUrl = 'https://public-api.wordpress.com/rest/v1.1/sites/bandofcharacters.wordpress.com/posts?number=1&fields=URL'
  $.getJSON(allPostsUrl)
    .then(function (data) {
      $('#url').val(data.posts[0].URL)
      $('#go').click()
    })

  // Temporary for development
  // $('#url').val('https://bandofcharacters.blog/2016/12/31/16-explore-a-new-part-of-the-usa-new-mexico/')
  // $('#go').click()
})
