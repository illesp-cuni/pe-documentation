# 🔧 Supported Methods & Theory
In this section, we will briefly explain the core concepts behind methods used in pe software. Because getting accurate information in systems with many degrees of freedom is computationally demanding, we employ methods which help approximate

In computational molecular modeling, two of the most widely used techniques are **Monte Carlo (MC)** and **Molecular Dynamics (MD)**. 

##Monte Carlo (MC) Method  
MC methods are statistical techniques that approximate thermodynamic properties by random sampling of molecular configurations. The central quantity in statistical mechanics, the **partition function**, is given by:

$$
\
Q = \sum_i e^{-\beta E_i} = \frac{1}{N! \Lambda^{3N}} \int e^{-\beta U(\mathbf{r}^N)} \, d\mathbf{r}^N
\
$$
where $\(U(\mathbf{r}^N)\)$ is the potential energy of a configuration of $\(N\)$ particles, and $\(\beta = 1/(k_B T)\)$.  

The ensemble average of a thermodynamic observable $\(A\)$ is:
$$
\langle A\rangle = \sum_i A_i P_i = \frac{\sum_i A_i e^{-\beta E_i}}{\sum_i e^{-\beta E_i}}
$$

where:  
- $\(A_i\)$ is the value of the observable in state $\(i\)$,  
- $\(P_i\)$ is the Boltzmann probability of state $\(i\)$, $\(P_i = \frac{e^{-\beta E_i}}{Z}\)$,  
- $\(E_i\)$ is the energy of state $\(i\)$,  
- $\(Z = \sum_i e^{-\beta E_i}\)$ is the partition function (or sum over states).

In continuous interacting chemical systems:
$$
\
\langle A \rangle = \frac{\int A(\mathbf{r}^N) e^{-\beta U(\mathbf{r}^N)} \, d\mathbf{r}^N}{\int e^{-\beta U(\mathbf{r}^N)} \, d\mathbf{r}^N}
\
$$
Analytical evaluation of the $\(\int e^{-\beta U(\mathbf{r}^N)} \, d\mathbf{r}^N\)$ integral is computationally impossible for large systems. MC circumvents this by **sampling configurations according to their Boltzmann probability**. This biased sampling is referred to as the **Metropolis algorithm**. In this method, configurations are sampled according to the **Boltzmann probability**:

$$ \ P(\mathbf{r}^N) \propto e^{-\beta U(\mathbf{r}^N)}\$$

The Metropolis algorithm generates a Markov chain of configurations by **proposing a trial move** from the current configuration $\(\mathbf{r}^N_{\text{old}}\)$ to a new configuration $\(\mathbf{r}^N_{\text{new}}\)$. The **acceptance of this move** is determined by the Metropolis criterion:

$$ \ P_{\mathrm{accept}} = \min \Big( 1, e^{-\beta \Delta U} \Big)\$$

where

$$ \ \Delta U = U(\mathbf{r}^N_{\text{new}}) - U(\mathbf{r}^N_{\text{old}})\$$

- If $\(\Delta U \le 0\)$, the new configuration is always accepted.  
- If $\(\Delta U > 0\)$, the new configuration is accepted with probability $\(e^{-\beta \Delta U}\)$, allowing the algorithm to explore higher-energy configurations and maintain detailed balance.  

This ensures that, over many steps, configurations are sampled according to the Boltzmann distribution, enabling accurate estimation of ensemble averages.

The partition function can be therefore approximated as sum over sampled states:
$$
\
Q = \sum_i e^{-\beta E_i} \approx \sum_{i=1}^{M} e^{-\beta E_i}
\
$$

where:  
- $\(E_i\)$ is the potential energy of state \(i\),  
- The sum on the right is over the \(M\) states sampled in Monte Carlo (MC).  


Once $\(M\)$ configurations $\(\{\mathbf{r}_1, \mathbf{r}_2, \dots, \mathbf{r}_M\}\)$ are sampled, the ensemble average of an observable $\(A(\mathbf{r}^N)\)$ can be approximated as:
$$
\
\langle A \rangle \approx \frac{1}{M} \sum_{k=1}^{M} A(\mathbf{r}_k)
\
$$
Here:  

- $\(\langle A \rangle\)$ is the ensemble (thermodynamic) average.  
- $\(\mathbf{r}_k\)$ is the $\(k\)$-th sampled configuration.  
- $\(M\)$ is the total number of sampled configurations.





## Molecular Dynamics (MD) Method  
Molecular Dynamics (MD) uses **Newton’s equations of motion** to simulate the time evolution of a system:
$$ \ m_i \frac{d^2 \mathbf{r}_i}{dt^2} = \mathbf{F}_i \ $$
where the **force** $\(\mathbf{F}_i\)$ on particle $\(i\)$ is derived from the potential energy $\(U(\mathbf{r}^N)\)$. Explicitly in Cartesian components:

$$
\begin{cases}
m_i \frac{d^2 x_i}{dt^2} = -\frac{\partial U}{\partial x_i} \\
m_i \frac{d^2 y_i}{dt^2} = -\frac{\partial U}{\partial y_i} \\
m_i \frac{d^2 z_i}{dt^2} = -\frac{\partial U}{\partial z_i} 
\end{cases}
$$

By integrating these equations of motion over small time steps, MD generates trajectories that sample the system’s **phase space**. Over long times, these trajectories approximate the ensemble distribution, allowing computation of thermodynamic and dynamic properties.

## Hamiltonian Monte Carlo (HMC) Method

Hamiltonian Monte Carlo (HMC) is a **hybrid method** that combines the strengths of **Monte Carlo (MC) sampling** and **Molecular Dynamics (MD)**. It uses **dynamical trajectories** to propose moves in configuration space while preserving the **Boltzmann distribution**, improving sampling efficiency for high-dimensional systems.

In HMC, we introduce **fictitious momenta** $\(\mathbf{p}_i\)$ for each particle and define the **Hamiltonian**:
$$
H(\mathbf{r}^N, \mathbf{p}^N) = U(\mathbf{r}^N) + K(\mathbf{p}^N)
$$

where:  
- $\(U(\mathbf{r}^N)\)$ is the potential energy,  
- $\(K(\mathbf{p}^N) = \sum_i \frac{\mathbf{p}_i^2}{2 m_i}\)$ is the kinetic energy associated with the momenta.

The **joint Boltzmann distribution** over positions and momenta is:
$$
P(\mathbf{r}^N, \mathbf{p}^N) \propto e^{-\beta H(\mathbf{r}^N, \mathbf{p}^N)}
$$

---

HMC uses **MD-like dynamics** to generate trial moves:

$$
\begin{cases}
\frac{d \mathbf{r}_i}{dt} = \frac{\partial H}{\partial \mathbf{p}_i} = \frac{\mathbf{p}_i}{m_i} \\
\frac{d \mathbf{p}_i}{dt} = -\frac{\partial H}{\partial \mathbf{r}_i} = -\frac{\partial U}{\partial \mathbf{r}_i}
\end{cases}
$$

- These equations are integrated numerically (e.g., using the **leapfrog integrator**) over a short trajectory.  
- The dynamics propose a new configuration in a **large, collective move**, which reduces the random-walk behavior typical of standard MC.

---

After generating a trajectory, the new configuration $\((\mathbf{r}^N_{\text{new}}$, $\mathbf{p}^N_{\text{new}})\)$ is accepted according to the **Metropolis criterion** based on the Hamiltonian:

$$
P_{\text{accept}} = \min \Big( 1, e^{-\beta \left[ H(\mathbf{r}^N_{\text{new}}, \mathbf{p}^N_{\text{new}}) - H(\mathbf{r}^N_{\text{old}}, \mathbf{p}^N_{\text{old}}) \right]} \Big)
$$

- If the Hamiltonian is exactly conserved, the move is always accepted.  
- Numerical integration errors may slightly change \(H\), which the Metropolis step corrects to maintain **detailed balance**.

---

