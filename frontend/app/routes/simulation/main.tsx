import { SimulationProvider } from '~/features/simulation/components/simulation-provider';
import Simulation from '~/features/simulation/components/simulation';

export default function App() {
  return (
    <SimulationProvider>
      <Simulation />
    </SimulationProvider>
  )
}