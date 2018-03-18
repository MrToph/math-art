class MathContainer extends ISteppable{
    constructor(element) {
        super();
        this.width = 1200;
        this.height = 500;

        this.currentStep = 0;
        this.colors = ["#ff3232", "#32ff32", "#3232ff"];
        this.element = element;

        this.maxStep = 7;
        this.oldInnerHTML = "";
        
        MathJax.Hub.Queue(() => {
          this.jax = MathJax.Hub.getAllJax("mathContainer")[0];
        },
        () => {this.redraw(0);});
    }


    redraw(step = this.currentStep){
        let innerHTML = this.getTextForCurrentStep();
        if(innerHTML !== this.oldInnerHTML){
            // this.element.style.visibility = "hidden";
            // this.element.innerHTML = innerHTML;
            this.oldInnerHTML = innerHTML;
            // MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.element],
            // () => {this.element.style.visibility = "visible";} 
            // );
            MathJax.Hub.queue.Push(["Text", this.jax, innerHTML]);
        }
    }

    getTextForCurrentStep(){
        let colorDefs = String.raw`\definecolor{colorRed}{RGB}{255,50,50}\definecolor{colorGreen}{RGB}{50,255,50}\definecolor{colorBlue}{RGB}{50,50,255}`;
        let text = "";
        switch(this.currentStep){
            case 5:
            case 6:
            case 7:
                text = String.raw`\textcolor{colorBlue}{a^2} + \textcolor{colorGreen}{b^2} = \textcolor{colorRed}{c^2}`;
                break;
            default: 
                text = "a^2 + b^2 = c^2";
        }
        return `${colorDefs} ${text}`;
    }
}
