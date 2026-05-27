import { SimulationProvider } from '~/features/simulation/components/simulation-provider';
import Simulation from '~/features/simulation/components/simulation';
import { Protect } from '~/features/auth/components/protect';

export default function App() {
  return (
    <Protect>
      <SimulationProvider>
        <Simulation />
      </SimulationProvider>
    </Protect>
  )
}
