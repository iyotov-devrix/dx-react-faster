document.addEventListener('DOMContentLoaded', function(){
	var documentBody =  document.querySelector('body');

	//open left sidebar on mobile
	
	//menus toggle
	let toggleElTrigger = document.querySelectorAll('[data-slide-trigger]');

	if(toggleElTrigger){
		toggleElTrigger.forEach( function(trigger, index){
			let linkingDataValue = trigger.getAttribute('data-slide-trigger');
			let toggleElControlled = document.querySelector(`[data-slide-element=${linkingDataValue}]`);

			
			if(toggleElControlled){
				let amount = toggleElTrigger.length;
				let median = Math.floor(amount/2 *10)/10; //eg 3.5
			
				let multiplier = median - index;
				let sign = (multiplier>0)?"-":"+";
				let translateY = multiplier*(-100);
				
				console.log(amount,median, multiplier, translateY, `calc(${translateY}% ${sign} ${Math. abs(multiplier) * 2}px)`);
				trigger.setAttribute("style", `--translateY: calc(${translateY}% ${sign} ${Math. abs(multiplier) * 2}px)`); 

				trigger.addEventListener('click', function(){
					toggleSlideFromLeft(trigger, toggleElControlled)
					bodyClassToggle(`is-scroll-disabled-by-${linkingDataValue}`)
				})

				toggleElControlled.addEventListener('click', function(event){
					if(event.target === toggleElControlled){
						toggleSlideFromLeft(trigger, toggleElControlled)
						bodyClassToggle(`is-scroll-disabled-by-${linkingDataValue}`)
					}
				})
			}
		})
	}

	function toggleSlideFromLeft(trigger, toggleElControlled){
		if(toggleElControlled.classList.contains('is-open')) {
			toggleElControlled.classList.add('is-closing')
			setTimeout(function(){	
				toggleElControlled.classList.remove('is-closing')
			}, 250)
		}
		toggleElControlled.classList.toggle('is-open')
		trigger.classList.toggle('is-open');
	}

	function bodyClassToggle(elementClass){
		documentBody.classList.toggle(elementClass);
	}
})