import { TweetCard } from "@/components/ui/tweet-card";

const TWEET_IDS = [
  "1976382199965602022",
  "1976437762950824362",
  "914134197413072898",
] as const;

const tweetCardClassName =
  "max-w-none border-[#F0D7B7] bg-[#FFF9F1] shadow-sm";

export function CommunityTweets() {
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="text-sm uppercase tracking-[0.3em] text-[#B07A3B]">
          社区热议
        </span>
        <h2 className="text-2xl font-semibold text-[#5C3A12] sm:text-3xl">
          看看咖啡爱好者们在聊什么
        </h2>
        <p className="max-w-2xl text-base text-[#6D5335]">
          来自社区的精选讨论，一起探索更多风味灵感。
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {TWEET_IDS.map((id) => (
          <TweetCard key={id} id={id} className={tweetCardClassName} />
        ))}
      </div>
    </section>
  );
}
