
/***** 
    JavaScript for the pricingSliders question theme
    Copyright (C) 2018 - Tony Partner (http://partnersurveys.com)
    Licensed MIT, GPL
    Version - 1.0
    Create date - 29/05/2018
*****/

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

function initPricingSliders(qID, randomOrder) {
	var thisQuestion = $('#question'+qID);
	
	$(thisQuestion).addClass('with-pricing-sliders');
			
	// Add some attributes
	var itemIndexes = [];
	$('.question-item', thisQuestion).each(function(i) {
		$(this).attr('data-ps-item', (i+1));
		$('.ps-slider-input', this).attr('data-ps-slider-index', (i+1));
		itemIndexes.push((i+1));
	});
			
	// Random answers?
	if(randomOrder == '1') {
		shuffleArray(itemIndexes);
		$(itemIndexes).each(function(i, val) {
			$('.subquestion-list.questions-list', thisQuestion).append($('.question-item[data-ps-item="'+val+'"]', thisQuestion));
		});
	}
	
	$('.ps-slider-input', thisQuestion).on('slideEnabled',function(){ 
		// Not used
	});
	
	function psHandleSliders(el) {
		var psSeparator = $(el).attr('data-ps-separator');
		var psStep =  $(el).attr('data-ps-step');
		var sliderVal = Number($(el).val().replace(psSeparator, '.'));
		
		var movedIndexNum = $(el).attr('data-ps-slider-index');
				
		var lowerSliders = $('.ps-slider-input', thisQuestion).filter(function() {
			return $(this).attr('data-ps-slider-index') < movedIndexNum;
		});
		var higherSliders = $('.ps-slider-input', thisQuestion).filter(function() {
			return $(this).attr('data-ps-slider-index') > movedIndexNum;
		});
				
		// Handle the higher and lower slider positions
		$(lowerSliders).each(function(i) {
			var thisVal = Number($(this).val().replace(psSeparator, '.'));
			var thisIndexNum = $(this).attr('data-ps-slider-index');
			var newSliderVal = sliderVal-((movedIndexNum*psStep)-(thisIndexNum*psStep));			
			if(thisVal > newSliderVal) {
				psMoveSlider($(this), newSliderVal);
			}
		});
		$(higherSliders).each(function(i) {
			var thisVal = Number($(this).val().replace(psSeparator, '.'));
			var thisIndexNum = $(this).attr('data-ps-slider-index');
			var newSliderVal = sliderVal+((thisIndexNum*psStep)-(movedIndexNum*psStep));			
			if(thisVal < newSliderVal) {
				psMoveSlider($(this), newSliderVal);
			}
		});
		function psMoveSlider(el, newSliderVal) {
				// Move the slider
				var thisName = $(el).attr('name').replace('slid', '');
				window.activeSliders['s'+thisName].getSlider().setValue(newSliderVal);
				
				//console.log(window.activeSliders['s'+thisName].getSlider().getValue());
				
				// Handle the inputs
				var displayValue = $(el).val().toString().replace('.', psSeparator); 
				$(el).val(displayValue);
				$(el).closest('li.answer-item').find('input.em_sq_validation').val(displayValue);
				
				// Fire Expression Manager
				ExprMgr_process_relevance_and_tailoring('keyup', thisName, 'change');
		}
	}
	
	$('body').on('slide slideStop', '#question'+qID+' .ps-slider-input', function(event) {
		psHandleSliders($(this))
	});
}
