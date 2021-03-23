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

Euler's method is relativly fast since it takes advantage of the recurrance relationship between the `kth and (k + 1)th` terms.

### Approach

Each of the three worker threads will compute a single estimate of `arctan(x)`.

i.e.

```
Worker 1: arctan(18)
Worker 2: arctan(57)
Worker 3: arctan(239)
```

Each worker will use `x` cycles to calculate `n` digits each.
The question was somewhat vague as to what `x` cycles meant.

- `x` total cycles among all workers?
- `x` total cycles on each worker?

I assume it means the latter.

The workers will then send back their estimates to the master node and the master will calculate pi.

```
pi = 4 * (12 * worker1Res + 8 * worker2Res - 5 * worker3Res)
```

### [Fixed point arithmatic](https://en.wikipedia.org/wiki/Fixed-point_arithmetic)

We use fixed point arithmatic to avoid dealing with floating point numbers.
Fixed point arithmatic means we "scale" the numbers we are working with by some constant in base 10 (10^x). We can then treat floating point numbers as integers, without loss of precision.

We do this because operations (especially division) between integers are much faster than between floats.

e.g.

```
nDigits = 20
// sclae by 10^20.
pi at end of comp =  314159265358979323548
// Shift the "." 20 places to the left.
pi to be returned = 3.14159265358979323548
```

### Restrictions

- `nCycles` and `nDigits` need to be in the range `[1, 60,000]` out of the box.
  - That is to say a 6 second timeout is enough for each lambda function.
- If you want to test ranges `>60,000`, you will need to manually change the timout on the lambda function.

**NOTE:**
Using 3 worker nodes, it takes around 3 minutes to calculate the first 1M digits of pi.

### How to run

```
curl -d '{"nCycles":1000, "nDigits":1000}' \
-H "Content-Type: application/json" \
-X POST  https://rjc3wbx2ta.execute-api.eu-central-1.amazonaws.com/calculate \
-o pi.txt
```

- URL will be different if running by yourself.

### Run your own Functions

The project uses [serverless](https://www.serverless.com/) an open source framework that creates a simple way to deploy and manage serverless functions on the cloud.

1. Install serverless.

```
npm install -g serverless
sls login

// create an account or login.
// connect a cloud provider in dashboard.
```

2. Clone project and install project

```
sls install -u https://github.com/trozler/pifinder.git
npm i
```

3. Deploy project and run.

```
sls deploy -v
```

4. Cleanup resources

```
sls remove
```

## Approach

My original approach was to use the standard unit circle Monte Carlo method for the approximation. However this method converged very slowly - it took 1 million iterations to accuratly estimate pi to 4 decimal places. This implemntation was written in Golang and did make use of the nice inbuilt concurrency support.

I then went through somewhat of a deep dive and tried a bunch of differnet pi algroithms. The historical deep dive provided by Craig Wood found [here](https://www.craig-wood.com/nick/articles/pi-machin/) was so usefuel. My implemntation of the Euler `arcTan` approximation has to be credited to this guide.

I eventually decided on the Machin series, as it distributes itself so naturally over 3 worker nodes and converges very quickly.

10 cycles accuratly estimate the first 7 decimal places of pi.

Apart from the `Chudnovsky` algroithm, that has been used in all world record approximations, the Machin is very good choice if you want to approximate pi.
