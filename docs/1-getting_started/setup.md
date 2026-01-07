# Setting Up PE

We recommend building the most recent version of PE, which can be found, along with it's libraries at  

` /storage/brno12-cerit/home/uhlik/pe/`.  

Specific files and folders of interest are : `libs, includes, pe.c, pe.mpi`

!!! danger "Warning"
    If this compilation is taking place on MetaCentrum, we strongly advise using the zuphux frontend environment. This compilation might or might not work on other frontends.

## 1. Prerequisites

Before starting the build process, ensure you have the following installed:

* **GCC (GNU Compiler Collection):** Required to compile the C source code.

* **Make:** The build automation tool.

* **MPI (Message Passing Interface):** Required for parallel execution on HPC systems (e.g., OpenMPI or MPICH).

## 2. Compilation and Build

Follow these steps to compile the PE executable:

### **Metacentrum Compilation**

#### A. Copy all necessary files

Since the we are located on MetaCentrum, we will copy the source code from location in the storage.
```bash
mkdir pe_compilation
cd pe_compilation
cp -r /storage/brno12-cerit/home/uhlik/include .
cp -r /storage/brno12-cerit/home/uhlik/lib .
cp /storage/brno12-cerit/home/uhlik/pe/pe.c .
cp /storage/brno12-cerit/home/uhlik/pe/ewald.c .
cp /storage/brno12-cerit/home/uhlik/pe/madelung.in pe.in
cp /storage/brno12-cerit/home/uhlik/pe/knot.h .
cp /storage/brno12-cerit/home/uhlik/pe/makefile .
```
#### B. Load necessary libraries
With all the files we can load libraries necessary for compilation.
```bash
module add gcc-4.8.4; module add fftw-3.3.4omp; module add openmpi-2.1.1-gcc; module add gsl-1.16-gcc;
```
Now we need to set our environment variables for the compiler. Since we copied libraries and includes into our compilation folder we will procceed as follows:

```bash
export HOME=$(pwd)
export PKG_CONFIG_PATH=$(pwd)/lib/pkgconfig:$PKG_CONFIG_PATH
```
#### C. Compile and test
For compilation we can use ```bash makefile``` included in the setup. To run the compilation you can simply run
```bash
make pe
```
Afterward we recommend to run a simple first instance of this program by using
```bash
./pe pe.in
```
If everything works, the output should look something like this :
```bash
init_trie: trie size 1M (cutoff 0.25)
2 vmd types
no transformation
initialization done
update_trie: trie is too small (226981>125)
init_trie: trie size 2M (cutoff 0.25)
ewald: alpha 0.8, cutoff/L 0.219022, max error in energy 6.13834e-05, max error in forces 8.93221e-05
ewald: E_0 -3046.61 (4.1e-05s)
ewald: E_k 167.275, 11 loops (1.66814s)
ewald: E_r -3105.45 (0.259587s)
ewald: total time 1.92777s
ewald: alpha 0.8, cutoff/L 0.219022, max error in energy 6.13834e-05, max error in forces 8.93221e-05
ewald: E_0 -3046.61 (0.000121s)
ewald: E_k 167.275, 11 loops (3.70075s)
ewald: E_r -3105.45 (0.272108s)
ewald: total time 3.97298s
ewald: alpha 0.8, cutoff/L 0.219022, max error in energy 6.13834e-05, max error in forces 8.93221e-05
ewald: E_0 -3045.65 (0.000117s)
ewald: E_k 168.648, 11 loops (3.72351s)
ewald: E_r -3128.91 (0.274374s)
ewald: total time 3.998s
ewald: alpha 0.8, cutoff/L 0.219022, max error in energy 6.13834e-05, max error in forces 8.93221e-05
ewald: E_0 -3045.65 (4.6e-05s)
ewald: E_k 168.648, 11 loops (1.67606s)
ewald: E_r -3128.91 (0.261271s)
ewald: total time 1.93738s
Madelung constant 6005.92 (FCS energy -6005.92)
# n=16, cycles=1(+0), n_beta=1, t_beta=1, beta0=0.01, dt 0.01(*1); <log(w)>=0 +- 0, SG 1, <Re> 0.00 +- 0.00 (0.00), <Rg> 0.00 +- 0.00 (0.00), <r^2> 0.00, AR 1.000, NE 2, NF 2
# accepted/rejected 1/0, RX accepted/rejected 0/0, PX accepted/rejected 0/0
# 1 steps done, 0.3s (278.7ms per step)

```