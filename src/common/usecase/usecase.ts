import  type { Results } from '../response/api-response';

export interface UseCase<T, V> {
  execute(data : T) : Promise<Results<V>>
}
