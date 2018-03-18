class MathContainer extends ISteppable{
    constructor(element) {
        super();
        this.width = 1200;
        this.height = 500;

        this.currentStep = 0;
        // this.colors = ["#ff3232", "#008000", "#3232ff", "#ffa500", "#8A2BE2"];
        this.element = element;

        this.maxStep = 2;
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
                                    \definecolor{colorBlue}{RGB}{50,50,255}\definecolor{colorOrange}{RGB}{255,165,0}\definecolor{colorPurple}{RGB}{138,43,226}`;
        let text = "";
        switch(this.currentStep){
            case 0:
                text = String.raw`2(\textcolor{colorRed}{1} + \textcolor{colorBlue}{2} + \textcolor{colorGreen}{3} + \textcolor{colorOrange}{4} + \ldots + \textcolor{colorPurple}{n})`;
                break;
            case 1:
            case 2:
                text = String.raw`2(1 + 2 + 3 + 4 + \ldots + n) = n (n+1)`;
        }
        return `${colorDefs} \\smash{${text}}`;
    }
}
