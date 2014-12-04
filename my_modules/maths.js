function pdist(x, method, p) {
    //x is a matrix, method can be euclidean, city block, minkowsi or correlation
    if (typeof(method) === 'undefined') {
        var method = 'euclidean';
    }
    if (method === 'minkowski' && typeof(p) === 'undefined') {
        var p = 2;
    }

    if (method === 'euclidean') {
        var p = 2;
    }

    if (method === 'city block') {
        var p = 1;
    }


    //make sure there are more than 2 rows
    if (x.length < 2) {
        console.log('can\'t calculate pairwise distance between less than 2 points :-(');
        return;
    }
    var pdist = []
    for (var i = 0; i < x.length; i++) {
        //start at row 0, compare with row 1, row 2 and so on; them go to row 1, compare with row 2, row 3 and so on; the next look always starts at i+1 even though it goes only to the point of x.lengh
        if (i + 1 < x.length) {
            for (var n = i + 1; n < x.length; n++) {

                //calculate the difference between each col of two consecutive rows
                if (x[i].length !== x[n].length) {
                    console.log('row ' + i + ' and ' + n + ' do not have the same length !');
                    return;
                }
                var dsum = 0;

                if (method === 'euclidean' || method === 'minkowski' || method === 'city block') {
                    for (var j = 0; j < x[i].length; j++) {

                        var d = Math.pow(Math.abs(x[n][j] - x[i][j]), p);
                        dsum += d;
                    }
                    pdist.push(Math.pow(dsum, 1 / p));
                } else if (method === 'correlation') {
                    var d = 1 - corr(x[n], x[i]);
                    pdist.push(d);
                }


            }
        }
    }

    return pdist;
}

function corr(x, y, type) {
    //Helena F Deus, 20100609
    //calculate correlation, method defined in type (Pearson, Kendall, Tau)
    //x and y are same length vectors; type can be Pearson only, so far

    //x and y should have the same length
    if (x.length !== y.length) {
        console.log('x and y lengths don\'t match :-(');
        return
    }
    if (typeof(type) === 'undefined') {
        var type = 'Pearson';
    }

    var N = x.length;
    //calculate the sum of the multiplication
    var sumX = 0;
    var sumX2 = 0;
    var sumY = 0;
    var sumY2 = 0;
    var sumXxY = 0;
    for (var i = 0; i < N; i++) {
        sumXxY += x[i] * y[i];
        sumX += x[i];
        sumX2 += Math.pow(x[i], 2);
        sumY += y[i];
        sumY2 += Math.pow(y[i], 2);
    }
    var r;
    if (type === 'Pearson') {
        r = (N * sumXxY - (sumX * sumY)) / Math.sqrt((N * sumX2 - Math.pow(sumX, 2)) * (N * sumY2 - Math.pow(sumY, 2)));
    }

    return r;
}

function squareform(x) {
    //x is a vector such as the one returned from pdist, to build a symmetric matrix (diagonal values = 0);

    //the x vector translates into a symmetric matrix; the matrix can be built from the top-left to the right bottom until there is no more data to fill; 
    var square = matrixdim(x);

    //now replace the zeros with the data in x
    var k = 0;
    for (var i = 0; i < square.length; i++) {
        for (var j = i + 1; j < square[i].length; j++) {
            square[i][j] = x[k];
            square[j][i] = x[k];
            k++;
        }
    }
    return square;
}

function matrixdim(x) {
    //to discover the dimension of the matrix, fill it with zeros until there is no more data
    var i = 0;
    var y = [];
    var square = [];
    var k = 0;
    while (1) {

        square[i] = [];
        square[i][i] = 0;
        for (var j = 0; j < i; j++) {
            square[i][j] = 0;
            square[j][i] = 0;
            k++;
            if (k >= x.length) {
                return square;
            }
        }
        i++;
    }
    return square;
}

function getij(x,i,j) {
    //x is the distance vector computed by pdist
    if(i==j) return 0;
    if(i>j) {
        var t = i;
        i=j;
        j=t;
    }
    n = 8618;
    loc = i*(n-1) - (i*(i+1))/2 + j;
    return x[loc];
}

module.exports.pdist = pdist;
module.exports.getij = getij;