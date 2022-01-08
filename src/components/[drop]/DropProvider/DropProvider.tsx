import { DropWithRoles } from "contract_interactions/getDropRolesData"
import { createContext, PropsWithChildren, useContext } from "react"

type Props = {
  drop: DropWithRoles
}

const DropContext = createContext<DropWithRoles>(null)

const DropProvider = ({ drop, children }: PropsWithChildren<Props>) => (
  <DropContext.Provider value={drop}>{children}</DropContext.Provider>
)

const useDrop = () => useContext(DropContext)

export { useDrop }
export default DropProvider
