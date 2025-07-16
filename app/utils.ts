export interface Repo {
    events: {
      [eventType: string]: number;
    }
    isOwnRepo: boolean;
  }
  
  export interface AllRepos {
    [repoName: string]: Repo;
  }

  export interface IEvent {
    repo: {
        name: string
    },
    type: string;
  }
export const compileRepoStruct = (events: IEvent[], username: string): AllRepos => {
    const allRepos: AllRepos = {};
    events.forEach(event => {
      const repoName = event.repo.name;
      const isOwnRepo = event.repo.name.split("/")[0] === username;

      // Initialize repo if not marked, adding first event and if is own repo
      if (!allRepos[repoName]) {
        allRepos[repoName] = { events: {[event.type]: 1 }, isOwnRepo };
      
      // If repo already marked, increment current event type
      } else {
        allRepos[repoName].events[event.type] = (allRepos[repoName].events[event.type] || 0) + 1;
      }
    })

    return allRepos;
}