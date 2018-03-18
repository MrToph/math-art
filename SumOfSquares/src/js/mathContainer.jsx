class MathContainer extends ISteppable{
    constructor(element) {
        super();
        this.width = 1200;
        this.height = 500;

        this.currentStep = 0;
        // this.colors = ["#ff3232", "#32ff32", "#3232ff", "#ffa500"];
        this.element = element;

        this.maxStep = 8;
        this.oldInnerHTML = "";

        MathJax.Hub.Queue(() => {
          this.jax = MathJax.Hub.getAllJax("mathContainer")[0];
        },
        () => {this.redraw(0);});
    }


    redraw(step = this.currentStep){
        let innerHTML = this.getTextForCurrentStep();
        if(innerHTML !== this.oldInnerHTML){
            this.oldInnerHTML = innerHTML;
            MathJax.Hub.queue.Push(["Text", this.jax, innerHTML]);
        }
    }

    getTextForCurrentStep(){
        let colorDefs = String.raw`\definecolor{colorRed}{RGB}{255,50,50}\definecolor{colorGreen}{RGB}{50,205,50}
                                    \definecolor{colorBlue}{RGB}{50,50,255}\definecolor{colorYellow}{RGB}{255,165,0}`;
        let text = "";
        switch(this.currentStep){
            case 0:
                text = String.raw`\textcolor{colorRed}{1^2} + \textcolor{colorGreen}{2^2} + \textcolor{colorBlue}{3^2} + \textcolor{colorYellow}{4^2} + \ldots + n^2`;
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                text = String.raw`3 \cdot (1^2 + 2^2 + 3^2 + 4^2 + \ldots + n^2)`;
                break;
            case 7:
            case 8:
                text = String.raw`3 \cdot (1^2 + 2^2 + 3^2 + 4^2 + \ldots + n^2) =  n (n+1) (n+\frac{1}{2})`;
                break;
            default: 
                text = String.raw`1^2 + 2^2 + 3^2 + 4^2 + \ldots + n^2 = \frac{1}{3} n (n+1) (n+\frac{1}{2})`;
        }
        return `${colorDefs} \\smash{${text}}`;
    }
}
