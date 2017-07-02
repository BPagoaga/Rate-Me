$(document).ready(function() {
	$('.upload-btn').on('click', function() {
		$('#upload-input').click()

		$('.progress-bar').text('0 %')
		$('.progress-bar').width('0%')
	})

	$('#upload-input').on('change', function() {
		const uploadInput = $('#upload-input').val()

		if (uploadInput != '') {
			let formData = new FormData()
			console.log(uploadInput)
			formData.append('upload', uploadInput[0].files[0])

			$.ajax({
				url: '/upload',
				type: 'POST',
				data: formData,
				processType: false,
				contentType: false,
				success: function(data) {
					$('#upload-input').val()
				},
				xhr: function() {
					var xhr = new new XMLHttpRequest()

					xhr.upload.addEventListener(
						'progress',
						function(e) {
							if (e.lengthComputable) {
								let uploadPercent = (e.loaded / e.total) * 100

								$('.progress-bar').text(uploadPercent + ' %')
								$('.progress-bar').width(uploadPercent + '%')

								if (uploadPercent == 100) {
									$('.progress-bar').text('Upload completed')
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