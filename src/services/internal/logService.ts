import { Container, Service } from "typedi";

@Service()
export class LogService {
    i = console.log;
    w = console.warn;
    e = console.error;
}

export const getLog = () => Container.get(LogService);
