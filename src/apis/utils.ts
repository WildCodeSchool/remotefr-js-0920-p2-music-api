export default function limitCalculQueryFromConnectedService(nbTotalShow, services): number {
  let nbServ = 0;
  Object.values(services).forEach((service: any) => {
    if (service.token !== null) nbServ += 1;
  });
  return nbTotalShow / nbServ;
}
