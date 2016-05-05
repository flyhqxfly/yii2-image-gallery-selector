jQuery(document).ready(function($){
    $(document).on('click','.gallery-selector-widget .gallery-selector-image',function(e){
        e.preventDefault();
        // $(this).toggleClass('added');

        var $this = $(this);
        var $context = $this.closest('.gallery-selector-widget');
        var $mediaModal = $this.closest('.modal');
        var $library = $context.find('.gallery-selector-container');
        var $selectedImageContainer = $context.find('.selected-images');

        // 先关闭所有已经选择的图片，再选中当前图片，实现单选效果
        $library.find('.gallery-selector-image.added').toggleClass('added');
        $(this).toggleClass('added');

        // 获取选中图像的 id
        var imageId = $this.attr('data-image-id');

        // 获取关联的隐藏图像 id 输入框的 id
        var selectdImg = $selectedImageContainer.find('.selected-img');
        var fieldId = selectdImg.attr('related-id');
        // alert(fieldId);

        // 修改关联的隐藏图像输入框的值
        var inputField = $('#' + fieldId);
        inputField.val(imageId);
        
        //clear old images
        $selectedImageContainer.find('.selected-img:not(.uploaded-img)').remove();

        //collect selected images
        var images = $library.find('.gallery-selector-image.added');
        images.each(function(i, el){
            var $el = $(el);
            var imageId = $el.data('image-id');
            var imgSrc = $el.data('image-url');

            if ($selectedImageContainer.find('.selected-img[data-image-id="' + imageId + '"]').length == 0){
                //template
                var template =  '<div class="selected-img" style="background-image: url(\'' + imgSrc + '\')" data-image-id="' + imageId + '" related-id="' + fieldId + '">' +
                                    '<input type="hidden" name="selected-image-ids[]" value="'+ imageId +'">'+
                                    //'<span class="glyphicon glyphicon-remove-sign remove-selected-image"></span>' +
                                '</div>';
                //append
                $selectedImageContainer.append(template);
            }

            $context.find('.no-image-selected').hide();
        });
    });

    $(document).on('click','.gallery-selector-widget .image-placeholder',function(e){
        e.preventDefault();
        var $this = $(this);
        var $container = $this.closest('.gallery-upload-container');
        var $context = $this.closest('.gallery-selector-widget');
        var $selectedImageContainer = $context.find('.selected-images');
        var _key = $this.data('upload-key');

        $('<input name="' + _key + '" type="file" multiple="1" accept="image/*" style="display: none;">').on('change', function(e){
            var $el = $(this);
            if (this.files && this.files.length > 0) {
                $.each(this.files, function(){
                    var reader = new FileReader();
                    var filename = this.name;
                    reader.onload = function(e) {
                        var template =  '<div class="selected-img uploaded-img" style="background-image: url(\'' + e.target.result + '\')">'+
                                            '<span class="glyphicon glyphicon-remove-sign remove-selected-image"></span>' +
                                        '</div>';
                        var $template = $(template);
                        $template.append($el);
                        $selectedImageContainer.append($template);

                        $context.find('.no-image-selected').hide();

                        var template_modal =  '<div class="gallery-uploader-image" data-image-name="' + filename + '" style="background-image: url(\'' + e.target.result + '\');" data-image-url="' + e.target.result + '"></div>';
                        $(template_modal).insertBefore($this);
                    }
                    reader.readAsDataURL(this);
                });
            }
        }).trigger('click');
    });

    $(document).on('click', '.gallery-selector-widget .gallery-image-select', function(e){
        //hide modal
        var $this = $(this);
        var $mediaModal = $this.closest('.modal');
        $mediaModal.modal('hide');
    });

    $(document).on('click', '.gallery-selector-widget .remove-selected-image', function(e){
        e.preventDefault();
        var $this = $(this);
        var $context = $this.closest('.gallery-selector-widget');

        //fadeout animation, remove and un-select from gallery....
        var $image = $(this).parent('.selected-img');
        var image_id = $image.find('input').val();
        $image.fadeOut('100', function(){
            $(this).remove();
            $context.find('.gallery-selector-image[data-image-id="' + image_id + '"]').removeClass('added');
            if ($context.find('.selected-img').length == 0) {
                $context.find('.no-image-selected').show();
            }
        });
    });
})
