class ISteppable{
    constructor() {
        this.maxStep = 0;
    }

    redraw(step = this.currentStep, forward){

    }

    onStep(forward){
        let nextStep = this.currentStep;
        if(forward)
          nextStep++;
        else{
          nextStep--;
        }
        nextStep = nextStep.clamp(0, this.maxStep);
        var buttonActivatorObj = {canBackward: false, canForward: false};
        if(nextStep > 0)
            buttonActivatorObj.canBackward = true;
        if(nextStep < this.maxStep)
            buttonActivatorObj.canForward = true;

        if(nextStep === this.currentStep)
            return buttonActivatorObj;
        
        this.currentStep = nextStep;
        this.redraw(this.currentStep, forward);
        return buttonActivatorObj;
    }

}
