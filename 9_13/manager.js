//1. CALULATE INVENTORY

/* constant */
var Z_MAX = 6;
var P=0;

/* function */
var avr = function(maxSale, probableSale, minSale) {
  return (maxSale+4*probableSale+minSale)/6;
};

var sd = function(maxSale, minSale) {
  return (maxSale-minSale)/6;
};
var criticalRatio = function(sellCost, buyCost, salvageCost) {
  return (sellCost-buyCost)/(sellCost-salvageCost);
};

/*  getting z from p  */
var getZ = function( criticalRatio ) {
  var Zs = [-2.326347874,-2.053748911,-1.880793608,-1.750686071,-1.644853627,-1.554773595,-1.475791028,-1.40507156,-1.340755034,-1.281551566,-1.22652812,-1.174986792,-1.126391129,-1.080319341,-1.036433389,-0.994457883,-0.954165253,-0.915365088,
    -0.877896295,-0.841621234,-0.806421247,-0.772193214,-0.738846849,-0.706302563,-0.67448975,-0.643345405,-0.612812991,-0.582841507,-0.55338472,-0.524400513,-0.495850347,-0.467698799,-0.439913166,-0.412463129,-0.385320466,
    -0.358458793,-0.331853346,-0.305480788,-0.279319034,-0.253347103,-0.227544977,-0.201893479,-0.176374165,-0.150969215,-0.125661347,-0.100433721,-0.075269862,-0.050153583,-0.025068908,0];
    var result = Zs.concat(
      Zs.filter(v=>v<0)
      .map(v=>-v)
      .reverse()
    ).map((v,k)=>({
      idx:k*0.01+0.01,
      value:v
    })).find(v=>criticalRatio<=v.idx)
    return result && result.value;
};

var optimal = function(o) {
      return avr(o.maxSale, o.probableSale, o.minSale)+
      getZ(criticalRatio(o.sellCost, o.buyCost, o.salvageCost))*
      sd(o.maxSale, o.minSale);
};

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('OptimalInventory').addEventListener('submit', calc);
});


function calc(event) {
  event.preventDefault();

  /* input from html */
  var fSell=document.getElementById('SellCost').value*1;
  var fBuy=document.getElementById('BuyCost').value*1;
  var fMin=document.getElementById('MinSale').value*1;
  var fMax=document.getElementById('MaxSale').value*1;
  var fProb=document.getElementById('ProbableSale').value*1;
  var fSalv=document.getElementById('SalvageCost').value*1;


  /* Message */
  if (fMin>fMax) {
    alert("Error! Min Sale bigger than Min Sale");
  }
  else if(fSell<fBuy){
    alert("Error! Your Purchase cost is bigger than your Selling cost");
  }
  else if(fProb<fMin || fProb>fMax){
    alert("Error! Probable Sale should be between MaxSale and MinSale");
  }
  else {

    document.getElementById('Optimal_output').innerHTML = Math.round(optimal(
    {
        maxSale:fMax,
        minSale:fMin,
        probableSale:fProb,
        sellCost:fSell,
        buyCost:fBuy,
        salvageCost:fSalv
      }
    ));

    /* Marker */
    startTransitions([{
      "amount":  (document.getElementById('MinSale').value*1-
      (document.getElementById('MinSale').value*1+document.getElementById('MaxSale').value*1+document.getElementById('ProbableSale').value*4)/6)/
      (document.getElementById('MaxSale').value*1-document.getElementById('MinSale').value*1)*6,
      "type": "min",
      "value": document.getElementById('MinSale').value*1
    },
    {
      "amount":getZ(criticalRatio(document.getElementById('SellCost').value*1,document.getElementById('BuyCost').value*1,document.getElementById('SalvageCost').value*1)),
      "type": "optimal",
      "value": ""
      //     avr(document.getElementById('MaxSale').value*1,document.getElementById('ProbalbeSale').value*1,document.getElementById('MinSale').value*1)+getZ(criticalRatio(document.getElementById('SellCost').value*1,document.getElementById('BuyCost').value*1))*
      //              sd(document.getElementById('MaxSale').value*1,document.getElementById('MinSale').value*1)
    },
    {
      "amount":  (document.getElementById('MaxSale').value*1-
      (document.getElementById('MinSale').value*1+document.getElementById('MaxSale').value*1+document.getElementById('ProbableSale').value*4)/6)/
      (document.getElementById('MaxSale').value*1-document.getElementById('MinSale').value*1)*6,
      "type": "max",
      "value": document.getElementById('MaxSale').value*1
    }]);

    /* clear all markers */
    d3.selectAll('#markers>g').remove();
  }
}

    function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
      var legendWidth  = 210,
      legendHeight = 40;

      // clipping to make sure nothing appears behind legend
      svg.append('clipPath')
      .attr('id', 'axes-clip')
      .append('polygon')
      .attr('points', (-margin.left)                 + ',' + (-margin.top)                 + ' ' +
      (chartWidth - legendWidth - 1) + ',' + (-margin.top)                 + ' ' +
      (chartWidth - legendWidth - 1) + ',' + legendHeight                  + ' ' +
      (chartWidth + margin.right)    + ',' + legendHeight                  + ' ' +
      (chartWidth + margin.right)    + ',' + (chartHeight + margin.bottom) + ' ' +
      (-margin.left)                 + ',' + (chartHeight + margin.bottom));

      var axes = svg.append('g')
      .attr('clip-path', 'url(#axes-clip)');

      axes.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + chartHeight + ')')
      //.call(xAxis)
      .append('text')
      .attr('x', 890)
      .attr('dy', '.99em')
      .style('text-anchor', 'end')
      .text('inventory');

      axes.append('g')
      .attr('class', 'y axis')

      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('probability');

      var legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)');

      legend.append('rect')
      .attr('class', 'legend-bg')
      .attr('width',  legendWidth)
      .attr('height', legendHeight);

      legend.append('rect')
      .attr('class', 'inner')
      .attr('width',  75)
      .attr('height', 20)
      .attr('x', 10)
      .attr('y', 10);

      legend.append('text')
      .attr('x', 90)
      .attr('y', 25)
      .text('sale distribution');
    }
    function drawPaths (svg, data, x, y) {

      var medianLine = d3.svg.line()
      .interpolate('basis')
      .x(function (d) { return x(d.amount); })
      .y(function (d) { return y(d.pct50); });

      var lowerInnerArea = d3.svg.area()
      .interpolate('basis')
      .x (function (d) { return x(d.amount) || 1; })
      .y0(function (d) { return y(d.pct50); })
      .y1(function (d) { return y(0); });

      svg.datum(data);

      svg.append('path')
      .attr('class', 'area lower inner')
      .attr('d', lowerInnerArea)
      .attr('clip-path', 'url(#rect-clip)');

      svg.append('path')
      .attr('class', 'median-line')
      .attr('d', medianLine)
      .attr('clip-path', 'url(#rect-clip)');

      /* leave groups for markers*/
      svg.append('g').attr('id', 'markers')
    }

    function addMarker (marker, chartHeight, x) {
      var radius = (marker.type === 'optimal' ? 40 : 32),
      xPos = x(marker.amount),
      yPosStart = chartHeight - radius - 3,
      yPosEnd = (marker.type === 'optimal' ? 50 : 100) + radius - 3;

      var markerG = d3.select('#markers').append('g')
      .attr('class', 'marker '+marker.type.toLowerCase())
      .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
      .attr('opacity', 0);

      markerG.transition()
      .duration(1000)
      .attr('transform', 'translate(' + (xPos-radius) + ', ' + yPosEnd + ')')
      .attr('opacity', 1);

      markerG.append('path')
      .attr('d', 'M' +radius + ',' + (chartHeight-yPosStart) + 'L'  + ',' + (chartHeight-yPosStart))
      .transition()
      .duration(1000)
      .attr('d', 'M' +radius + ',' + (chartHeight-yPosEnd) + 'L' + radius + ',' + (radius*2));

      markerG.append('circle')
      .attr('class', 'marker-bg')
      .attr('cx', radius)
      .attr('cy', radius)
      .attr('r', radius);

      markerG.append('text')
      .attr('x', radius)
      .attr('y', radius*0.9)
      .text(marker.type);

      markerG.append('text')
      .attr('x', radius)
      .attr('y', radius*1.5)
      .text(marker.value);
    }

    var rawData=[
      {
        "amount": "-5",
        "pct50": 1.48672E-06
      },
      {
        "amount": "-4",
        "pct50": 0.00013383
      },
      {
        "amount": "-3",
        "pct50": 0.004431848,
      },
      {
        "amount": "-2.326347874",
        "pct50": 0.026652142,
      },
      {
        "amount": "-2.053748911",
        "pct50": 0.048418136,
      },
      {
        "amount": "-1.880793608",
        "pct50": 0.068041951,
      },
      {
        "amount": "-1.750686071",
        "pct50": 0.086173774,
      },
      {
        "amount": "-1.644853627",
        "pct50": 0.10313564 ,
      },
      {
        "amount": "-1.281551566",
        "pct50": 0.175498332,
      },
      {
        "amount": "-0.841621234",
        "pct50": 0.27996192,
      },
      {
        "amount": "-0.524400513",
        "pct50": 0.347692614,
      },
      {
        "amount": "-0.253347103",
        "pct50": 0.386342533,
      },
      {
        "amount": "0",
        "pct50": 0.39894228,
      },
      {
        "amount": "0.253347103",
        "pct50": 0.386342533,
      },
      {
        "amount": "0.524400513",
        "pct50": 0.347692614,
      },
      {
        "amount": "0.841621234",
        "pct50": 0.27996192,
      },
      {
        "amount": "1.644853627",
        "pct50": 0.10313564 ,
      },
      {
        "amount": "1.281551566",
        "pct50": 0.175498332,
      },
      {
        "amount": "1.750686071",
        "pct50": 0.086173774,
      },
      {
        "amount": "1.880793608",
        "pct50": 0.068041951,
      },
      {
        "amount": "2.053748911",
        "pct50": 0.048418136,
      },
      {
        "amount": "2.326347874",
        "pct50": 0.026652142,
      },
      {
        "amount": "3",
        "pct50": 0.004431848,
      },
      {
        "amount": "4",
        "pct50": 0.00013383,
      },
      {
        "amount": "5",
        "pct50": 1.48672E-06,
      }
    ];

    var data = rawData.map(function (o) {
      return { amount: o.amount, pct50: o.pct50  };
    });


    var markerData = [
      {
        "amount": "100",
        "type": "min",
        "value": ""
      },
      {
        "amount": "100",
        "type": "optimal",
        "value": ""
      },
      {
        "amount": "100",
        "type": "max",
        "value": ""
      }
    ];


    var svgWidth  = 960,
    svgHeight = 500,
    margin = { top: 20, right: 20, bottom: 40, left: 40 },
    chartWidth  = svgWidth  - margin.left - margin.right,
    chartHeight = svgHeight - margin.top  - margin.bottom;

    var svg = d3.select('body').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scale.linear().range([0,chartWidth ])
    .domain([-5,5]),
    y = d3.scale.linear().range([chartHeight, 0])
    .domain([0, 0.7]);///////////

    var xAxis = d3.svg.axis().scale(x).orient('bottom')
    .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
    yAxis = d3.svg.axis().scale(y).orient('left')
    // .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

    // clipping to start chart hidden and slide it in later
    var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
    .attr('width', 0)
    .attr('height', chartHeight);

    function startTransitions (markers) {
      rectClip.transition()
      .duration(1000*markers.length)
      .attr('width', chartWidth);

      markers.forEach(function (marker, i) {
        setTimeout(function () {
          addMarker(marker, chartHeight, x);
        }, 1000 + 500*i);
      });
    }

    function makeChart (data, markers) {
      addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
      drawPaths(svg, data, x, y);

      startTransitions(markers, x);
    }

    makeChart(data, markerData);
