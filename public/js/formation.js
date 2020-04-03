$(document).ready(function() {
    fetchFormationData().then(function(data) {
        buildParityChart(data.result)
        buildBourseChart(data.result)
        buildMentionChart(data.result)
        buildNumberOneChart(data.result)
        buildNumberOneAdmChart(data.result)
        buildSameAccChart(data.result)

    }).catch(console.error)

    let width = 500
        height = 400
        margin = 100

    function fetchFormationData() {
        recordId = $("main").attr("recordId")
        return new Promise((resolve, reject) => {
            $.get(`/formation_data/${recordId}`, function(data) {
              resolve(data)
            });
        })
    }

    function buildParityChart(d) {
        let propTot = d.fields.prop_tot
        let numberW= d.fields.prop_tot_f
        let numberM = propTot - numberW

        let propH = numberM / propTot * 100
        let propW = numberW / propTot * 100

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        let radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        let svg = d3.select("#parity-chart")
          .append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create dummy data
        let data = {a: {value: Math.round(propH), label: " d'hommes"}, b: {value: Math.round(propW), label: "de femmes"}}

        // set the color scale
        let color = d3.scaleOrdinal()
          .domain(["#0170bf", "#5499c7"])
          .range(d3.schemeDark2);

        // Compute the position of each group on the pie:
        let pie = d3.pie()
          .sort(null) // Do not sort group by size
          .value(function(d) {return d.value.value; })
        let data_ready = pie(d3.entries(data))


        // The arc generator
        let arc = d3.arc()
          .innerRadius(radius * 0.5)         // This is the size of the donut hole
          .outerRadius(radius * 0.8)

        // Another arc that won't be drawn. Just for labels positioning
        let outerArc = d3.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
          .selectAll('allSlices')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d){ return(color(d.data.key)) })
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 0.7)

        // Add the polylines between chart and labels:
        svg
          .selectAll('allPolylines')
          .data(data_ready)
          .enter()
          .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
              var posA = arc.centroid(d) // line insertion in the slice
              var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
              var posC = outerArc.centroid(d); // Label position = almost the same as posB
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
              posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
              return [posA, posB, posC]
            })

        // Add the polylines between chart and labels:
        svg
          .selectAll('allLabels')
          .data(data_ready)
          .enter()
          .append('text')
            .text( function(d) { return d.data.value.value+"% "+d.data.value.label } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
    }

    function buildBourseChart(d) {

        let prop_b = d.fields.p_acc_boursier
        let prop_nb = 100 - prop_b


        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        let radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        let svg = d3.select("#bourse-chart")
          .append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create dummy data
        let data = {a: {value: Math.round(prop_b), label: "de boursiers"}, b: {value: Math.round(prop_nb), label: "de non boursiers"}}

        // set the color scale
        let color = d3.scaleOrdinal()
          .domain(["#0170bf", "#5499c7"])
          .range(d3.schemeDark2);

        // Compute the position of each group on the pie:
        let pie = d3.pie()
          .sort(null) // Do not sort group by size
          .value(function(d) {return d.value.value; })
        let data_ready = pie(d3.entries(data))


        // The arc generator
        let arc = d3.arc()
          .innerRadius(radius * 0.5)         // This is the size of the donut hole
          .outerRadius(radius * 0.8)

        // Another arc that won't be drawn. Just for labels positioning
        let outerArc = d3.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
          .selectAll('allSlices')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d){ return(color(d.data.key)) })
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 0.7)

        // Add the polylines between chart and labels:
        svg
          .selectAll('allPolylines')
          .data(data_ready)
          .enter()
          .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
              var posA = arc.centroid(d) // line insertion in the slice
              var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
              var posC = outerArc.centroid(d); // Label position = almost the same as posB
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
              posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
              return [posA, posB, posC]
            })

        // Add the polylines between chart and labels:
        svg
          .selectAll('allLabels')
          .data(data_ready)
          .enter()
          .append('text')
            .text( function(d) { return d.data.value.value+"% "+d.data.value.label } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
    }

    function buildMentionChart(d) {
            let propPassable = Math.round(d.fields.p_acc_passable)
            let propAssezBien = Math.round(d.fields.p_acc_assez_bien)
            let propBien = Math.round(d.fields.p_acc_bien)
            let propTresBien = Math.round(d.fields.p_acc_tres_bien)

            // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
            let radius = Math.min(width, height) / 2 - margin

            // append the svg object to the div called 'my_dataviz'
            let svg = d3.select("#mentions-chart")
              .append("svg")
                .attr("width", width)
                .attr("height", height)
              .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            // Create dummy data
            let data = { a: {value: propPassable, label: "Passable"}, b: {value: propAssezBien, label: "Assez Bien"},
            c: {value: propBien, label: "Bien"}, d: {value: propTresBien, label: "Très Bien"}}

            // set the color scale
            let color = d3.scaleOrdinal()
              .domain(["#0170bf", "#5499c7", "#5499c7", "#5499c7"])
              .range(d3.schemeDark2);

            // Compute the position of each group on the pie:
            let pie = d3.pie()
              .sort(null) // Do not sort group by size
              .value(function(d) {return d.value.value; })
            let data_ready = pie(d3.entries(data))


            // The arc generator
            let arc = d3.arc()
              .innerRadius(radius * 0.5)         // This is the size of the donut hole
              .outerRadius(radius * 0.8)

            // Another arc that won't be drawn. Just for labels positioning
            let outerArc = d3.arc()
              .innerRadius(radius * 0.9)
              .outerRadius(radius * 0.9)

            // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            svg
              .selectAll('allSlices')
              .data(data_ready)
              .enter()
              .append('path')
              .attr('d', arc)
              .attr('fill', function(d){ return(color(d.data.key)) })
              .attr("stroke", "white")
              .style("stroke-width", "2px")
              .style("opacity", 0.7)

            // Add the polylines between chart and labels:
            svg
              .selectAll('allPolylines')
              .data(data_ready)
              .enter()
              .append('polyline')
                .attr("stroke", "black")
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr('points', function(d) {
                  var posA = arc.centroid(d) // line insertion in the slice
                  var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                  var posC = outerArc.centroid(d); // Label position = almost the same as posB
                  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                  posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                  return [posA, posB, posC]
                })

            // Add the polylines between chart and labels:
            svg
              .selectAll('allLabels')
              .data(data_ready)
              .enter()
              .append('text')
                .text( function(d) { return d.data.value.label+" "+d.data.value.value+"%" } )
                .attr('transform', function(d) {
                    var pos = outerArc.centroid(d);
                    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                .style('text-anchor', function(d) {
                    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    return (midangle < Math.PI ? 'start' : 'end')
                })
        }

    function buildNumberOneChart(d) {
        let candidature_tot = d.fields.voe_tot
        let number_one_tot = d.fields.voe1

        let prop_one = Math.round(number_one_tot / candidature_tot * 100)
        let prop_other = Math.round(100 - prop_one)

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        let radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        let svg = d3.select("#numberOne-chart")
          .append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create dummy data
        let data = { a: {value: prop_one, label: "Voeux n°1"}, b: {value: prop_other, label: "Autres voeux"}}

        // set the color scale
        let color = d3.scaleOrdinal()
          .domain(["#0170bf", "#5499c7"])
          .range(d3.schemeDark2);

        // Compute the position of each group on the pie:
        let pie = d3.pie()
          .sort(null) // Do not sort group by size
          .value(function(d) {return d.value.value; })
        let data_ready = pie(d3.entries(data))


        // The arc generator
        let arc = d3.arc()
          .innerRadius(radius * 0.5)         // This is the size of the donut hole
          .outerRadius(radius * 0.8)

        // Another arc that won't be drawn. Just for labels positioning
        let outerArc = d3.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
          .selectAll('allSlices')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d){ return(color(d.data.key)) })
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 0.7)

        // Add the polylines between chart and labels:
        svg
          .selectAll('allPolylines')
          .data(data_ready)
          .enter()
          .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
              var posA = arc.centroid(d) // line insertion in the slice
              var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
              var posC = outerArc.centroid(d); // Label position = almost the same as posB
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
              posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
              return [posA, posB, posC]
            })

        // Add the polylines between chart and labels:
        svg
          .selectAll('allLabels')
          .data(data_ready)
          .enter()
          .append('text')
            .text( function(d) { return d.data.value.label+" "+d.data.value.value+"%" } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
        }

    function buildNumberOneAdmChart(d) {
        console.log(d)
        let adm_tot = d.fields.acc_tot
        let number_one_tot = d.fields.acc_voe1

        let prop_one = Math.round(number_one_tot / adm_tot * 100)
        let prop_other = Math.round(100 - prop_one)

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        let radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        let svg = d3.select("#numberOne-adm-chart")
          .append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create dummy data
        let data = { a: {value: prop_one, label: "Voeux n°1"}, b: {value: prop_other, label: "Autres voeux"}}

        // set the color scale
        let color = d3.scaleOrdinal()
          .domain(["#0170bf", "#5499c7"])
          .range(d3.schemeDark2);

        // Compute the position of each group on the pie:
        let pie = d3.pie()
          .sort(null) // Do not sort group by size
          .value(function(d) {return d.value.value; })
        let data_ready = pie(d3.entries(data))


        // The arc generator
        let arc = d3.arc()
          .innerRadius(radius * 0.5)         // This is the size of the donut hole
          .outerRadius(radius * 0.8)

        // Another arc that won't be drawn. Just for labels positioning
        let outerArc = d3.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
          .selectAll('allSlices')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d){ return(color(d.data.key)) })
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 0.7)

        // Add the polylines between chart and labels:
        svg
          .selectAll('allPolylines')
          .data(data_ready)
          .enter()
          .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
              var posA = arc.centroid(d) // line insertion in the slice
              var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
              var posC = outerArc.centroid(d); // Label position = almost the same as posB
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
              posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
              return [posA, posB, posC]
            })

        // Add the polylines between chart and labels:
        svg
          .selectAll('allLabels')
          .data(data_ready)
          .enter()
          .append('text')
            .text( function(d) { return d.data.value.label+" "+d.data.value.value+"%" } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
        }

    function buildSameAccChart(d) {
        let same_acc = Math.round(d.fields.p_acc_academies)
        let others = 100 - same_acc

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        let radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        let svg = d3.select("#same-acc-chart")
          .append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create dummy data
        let data = { a: {value: same_acc, label: "Oui"}, b: {value: others, label: "Non"}}

        // set the color scale
        let color = d3.scaleOrdinal()
          .domain(["#0170bf", "#5499c7"])
          .range(d3.schemeDark2);

        // Compute the position of each group on the pie:
        let pie = d3.pie()
          .sort(null) // Do not sort group by size
          .value(function(d) {return d.value.value; })
        let data_ready = pie(d3.entries(data))


        // The arc generator
        let arc = d3.arc()
          .innerRadius(radius * 0.5)         // This is the size of the donut hole
          .outerRadius(radius * 0.8)

        // Another arc that won't be drawn. Just for labels positioning
        let outerArc = d3.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
          .selectAll('allSlices')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d){ return(color(d.data.key)) })
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 0.7)

        // Add the polylines between chart and labels:
        svg
          .selectAll('allPolylines')
          .data(data_ready)
          .enter()
          .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
              var posA = arc.centroid(d) // line insertion in the slice
              var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
              var posC = outerArc.centroid(d); // Label position = almost the same as posB
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
              posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
              return [posA, posB, posC]
            })

        // Add the polylines between chart and labels:
        svg
          .selectAll('allLabels')
          .data(data_ready)
          .enter()
          .append('text')
            .text( function(d) { return d.data.value.label+" "+d.data.value.value+"%" } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
        }


})
