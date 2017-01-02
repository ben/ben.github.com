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
    const blurb = $('#blurb').val()

    const apiUrl = 'https://public-api.wordpress.com/rest/v1.1/sites/bandofcharacters.wordpress.com/posts?pretty=1&fields=ID,title,slug,URL,attachments'
    $.getJSON(apiUrl)
      .then(function (data) {
        data.posts.forEach(function (post) {
          if (url.indexOf(post.slug) === -1) return;
          console.log(post)

          // Extract title to avoid accidental hashtags
          const title = decodeEntities(post.title.replace('#', 'Thing '))
          const firstImage = post.attachments[Object.keys(post.attachments)[0]] || {}
          const imageUrl = firstImage.URL || ''

          // Facebook
          const fbText = `${blurb}\n#hundredthings\n${url}`

          // Twitter
          const twText = `${title} #hundredthings\n${post.URL} ${imageUrl}`

          // Instagram
          const igText = `${title}\n\n${blurb}\n\n#hundredthings (Follow along by gong to the link in my bio!)`

          $('#facebook').val(fbText)
          $('#twitter').val(twText)
          $('#instagram').val(igText)
        })
    })

    $('#facebook').focus(function () {
      $('#facebook').select()
    })

    console.log(url, blurb)
  })

  // Temporary for development
  $('#url').val('https://bandofcharacters.blog/2016/12/31/36-make-a-photo-every-day-book/')
  $('#blurb').val('this is a blurb')
  $('#go').click()
})
