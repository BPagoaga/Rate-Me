$(document).ready(function() {
    $('.upload-btn').on('click', function() {
        $('#upload-input').click()

        $('.progress-bar').text('0 %')
        $('.progress-bar').width('0%')
    })

    $('#upload-input').on('change', function() {
        const uploadInput = $('#upload-input')

        if (uploadInput !== '') {
            const formData = new FormData()

            formData.append('upload', uploadInput[0].files[0])

            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success() {
                    $('#upload-input').val()
                },
                xhr() {
                    const xhr = new XMLHttpRequest()

                    xhr.upload.addEventListener(
                        'progress',
                        function(event) {
                            if (event.lengthComputable) {
                                const uploadPercent = event.loaded / event.total * 100
                                $('.progress-bar').text(`${uploadPercent} %`)
                                $('.progress-bar').width(`${uploadPercent}%`)

                                if (uploadPercent === 100) {
                                    $('.progress-bar').text('Upload completed')
                                    $('#completed').text('File uploaded')
                                }
                            }
                        },
                        false
                    )

                    return xhr
                }
            })
        }
    })
})