class MathContainer extends ISteppable{
    constructor(element) {
        super();
        this.width = 1200;
        this.height = 500;

        this.currentStep = 0;
        // this.colors = ["#ff3232", "#008000", "#3232ff", "#ffa500", "#8A2BE2"];
        this.element = element;

        this.maxStep = 1;
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
                                    \definecolor{colorBlue}{RGB}{50,50,255}\definecolor{colorYellow}{RGB}{255,165,0}\definecolor{colorPurple}{RGB}{138,43,226}`;
        let text = "";
        switch(this.currentStep){
            case 0:
                text = String.raw`\textcolor{colorRed}{1^2} + \textcolor{colorGreen}{2^2} + \textcolor{colorBlue}{3^2} + \ldots + \textcolor{colorYellow}{n^2}`;
                break;
            case 1:
                text = String.raw`3 (\textcolor{colorRed}{1^2} + \textcolor{colorGreen}{2^2} + \textcolor{colorBlue}{3^2} + \ldots + \textcolor{colorYellow}{n^2}) 
                                    = \frac{n (n+1)}{2} \textcolor{colorPurple}{(2n + 1)}`;
        }
        return `${colorDefs} \\smash{${text}}`;
    }
}
