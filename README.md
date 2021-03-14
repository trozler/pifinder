## A distributed way of calculating Pi.

### Algorithm

The core algoirthm used to find pi will be the [John Machine Algorithm (1706)](https://www.craig-wood.com/nick/articles/pi-machin/).

We will be using Gauss's version of the Machine Series and utilse the Euler's method for calculating `arctan(x)`.

So the series we are caluclating ends up looking like this:

**Gauss's version**

```
pi = 4 * (12 * arctan(18) + 8 * arctan(57) - 5 * arctan(239))
```

**Eulers's method**

<img width="788" alt="Screenshot 2021-03-13 at 20 24 24" src="https://user-images.githubusercontent.com/43752286/111041761-2e054900-843a-11eb-86d7-1be8297dfc37.png">

Euler's method is relativly fast since it takes advantage of the recurrance relationship between the `kth and (k + 1)th` terms in the denominator.

### Approach

Each of the three worker threads will compute a single estimate of `arctan(x)`.

i.e.

```
Worker 1: arctan(18)
Worker 2: arctan(57)
Worker 3: arctan(239)
```

Each worker will use `x` cycles to calculate `n` digits each.
The question was somewhat vague as to what `x` cycles meant?

- `x` total cycles among all workers?
- `x` total cycles on each worker.

I assume it means the latter.

The workers will then send back their estimates to the master node and the master will calculate pi.

```
pi = 4 * (12 * worker1Res + 8 * worker2Res - 5 * worker3Res)
```

### [Fixed point arithmatic](https://en.wikipedia.org/wiki/Fixed-point_arithmetic)

We use fixed point arithmatic to avoid dealing with any floating point numbers, until right at the end of the computation.
Fixed point arithmatic means we "scale" the numbers we are working with by can treat floating point numbers as integers, without loss of precision.

We do this because operations (especially division) between integers are much faster than between floats.

e.g.

```
nDigits = 20
pi at end of comp =  314159265358979323548
// Shift the "." 20 places to the left.
pi to be returned = 3.14159265358979323548
```

### Restrictions

```
POST /calculate

{
  nCycles: x,
  nDigits: n
}
```

- `nCycles` needs to be in the range `[1, 100,000]`.

  - 1M cycles per worker should be more than enough for the series to converge.
  - e.g When `nCycles = 1`, the series succesfully find the first 4 terms of pi.

- `nDigits` needs to be in the range `[1, 100,000]`.
  - NOTE: Using 3 worker nodes, it takes around 5 minutes to calculate the first 1M digits of pi. But I don't wan't to pay for that.

### Architecture



#### How to run

The project uses serverless an open source framework that creates a simple way to deploy and manage serverless functions on the cloud. 

1. Install serverless. 

```
npm install -g serverless
sls login

// create an account or login.
```

2. Clone project

```

```
