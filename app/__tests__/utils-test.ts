import { compileRepoStruct } from "../utils";

interface Event {
    repo: {
        name: string;
    };
    type: string;
}

describe('compileRepoStruct', () => {
    const mockEvents: Event[] = [
        { repo: { name: "alice/repo1" }, type: "PushEvent" },
        { repo: { name: "alice/repo1" }, type: "PushEvent" },
        { repo: { name: "alice/repo1" }, type: "PullRequestEvent" },
        { repo: { name: "alice/repo1" }, type: "PushEvent" },
        { repo: { name: "bob/repo2" }, type: "PullRequestEvent" },
        { repo: { name: "bob/repo2" }, type: "IssueCommentEvent" },
        { repo: { name: "bob/repo2" }, type: "PullRequestEvent" },
        { repo: { name: "bob/repo2" }, type: "PushEvent" },
        { repo: { name: "charlie/repo3" }, type: "PushEvent" },
        { repo: { name: "charlie/repo3" }, type: "IssueCommentEvent" },
    ];

    const username = "alice";

    const result = compileRepoStruct(mockEvents, username);

    test('should correctly compile event counts per repo', () => {
        expect(result).toEqual({
            "alice/repo1": {
                isOwnRepo: true,
                events: {
                    PushEvent: 3,
                    PullRequestEvent: 1
                }
            },
            "bob/repo2": {
                isOwnRepo: false,
                events: {
                    PullRequestEvent: 2,
                    IssueCommentEvent: 1,
                    PushEvent: 1
                }
            },
            "charlie/repo3": {
                isOwnRepo: false,
                events: {
                    PushEvent: 1,
                    IssueCommentEvent: 1
                }
            }
        });
    });

    test('should correctly flag owned repos', () => {
        expect(result["alice/repo1"].isOwnRepo).toBe(true);
        expect(result["bob/repo2"].isOwnRepo).toBe(false);
        expect(result["charlie/repo3"].isOwnRepo).toBe(false);
    });
});
