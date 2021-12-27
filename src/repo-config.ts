import { loadJsonFile } from './github';
import { readPageAttributes } from './utils';
import { RepoConfig } from './type-declare';

const pageAttributes = readPageAttributes();

let promise: Promise<RepoConfig>;

export const getRepoConfig = () => {
  if (!promise) {
    promise = loadJsonFile<RepoConfig>('beaudar.json').then(
      (data) => {
        if (!Array.isArray(data.origins)) {
          data.origins = [];
        }
        return data;
      },
      () => ({
        origins: [pageAttributes.origin],
      }),
    );
  }

  return promise;
};
