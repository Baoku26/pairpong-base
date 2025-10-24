import { useState, useEffect } from "react";
import {
  Trophy,
  TrendingUp,
  RefreshCw,
  Crown,
  Medal,
  Award,
  Target,
  Zap,
  ChartBarIncreasingIcon,
  Clock,
  User,
  Hash,
} from "lucide-react";

const LeaderBoard = () => {
  const [battles, setBattles] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("recent");

  // Mock data for demonstration - replace with your actual data fetching
  const mockBattles = [
    {
      id: 1,
      winner: "BTC",
      loser: "ETH",
      player: "0x1234...5678",
      delta: 15.42,
      scoreA: 85,
      scoreB: 72,
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      winner: "SOL",
      loser: "ADA",
      player: "0x9876...4321",
      delta: 12.38,
      scoreA: 78,
      scoreB: 65,
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      winner: "DOGE",
      loser: "SHIB",
      player: "0x5555...7777",
      delta: 8.92,
      scoreA: 92,
      scoreB: 84,
      timestamp: new Date().toISOString(),
    },
  ];

  const mockUserStats = {
    wins: 12,
    losses: 8,
    highestDelta: 23.45,
    totalBattles: 20,
    winRate: 60,
    rank: 15,
  };

  const mockTopPlayers = [
    {
      rank: 1,
      address: "0x1111...2222",
      wins: 45,
      winRate: 85.7,
      totalDelta: 234.56,
    },
    {
      rank: 2,
      address: "0x3333...4444",
      wins: 38,
      winRate: 82.1,
      totalDelta: 198.32,
    },
    {
      rank: 3,
      address: "0x5555...6666",
      wins: 35,
      winRate: 79.5,
      totalDelta: 187.91,
    },
  ];

  useEffect(() => {
    fetchLeaderboardData();
    const interval = setInterval(fetchLeaderboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBattles(mockBattles);
      setUserStats(mockUserStats);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (rank) => {
    const iconClass = "w-6 h-6";
    switch (rank) {
      case 1:
        return (
          <Crown className={`${iconClass} text-yellow-400 drop-shadow-sm`} />
        );
      case 2:
        return (
          <Medal className={`${iconClass} text-gray-300 drop-shadow-sm`} />
        );
      case 3:
        return (
          <Award className={`${iconClass} text-amber-600 drop-shadow-sm`} />
        );
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center bg-[#26462F] rounded-full border border-[#00ff88]/30">
            <span className="text-xs font-bold text-[#9EB39F]">{rank}</span>
          </div>
        );
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMinutes = Math.floor((now - then) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    bgColor,
    borderColor,
  }) => (
    <div
      className={`relative group p-4 flex flex-col items-center ${bgColor} ${borderColor} border rounded-sm   transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-${color}/10`}
    >
      <div className="flex items-center justify-between m-4 w-[80%] ">
        <Icon className={`w-5 h-5 ${color} opacity-80`} />
        <div className={`text-3xl font-black ${color} tracking-tight`}>
          {value}
        </div>
      </div>
      <div className="text-[#9EB39F] text-sm font-medium uppercase tracking-wider">
        {label}
      </div>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-transparent to-${color}/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </div>
  );

  const BattleCard = ({ battle }) => (
    <div className="group bg-[#1a1f2e] border border-[#00ff88]/20 rounded-xl p-6 transition-all duration-300 hover:border-[#F5C542]/50 hover:shadow-lg hover:shadow-[#F5C542]/10 hover:scale-[1.01]">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        {/* Battle Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-[#00ff88] font-bold text-xl tracking-wide">
                {battle.winner}
              </span>
              <div className="px-3 py-1 bg-[#26462F] border border-[#00ff88]/30 rounded-full">
                <span className="text-[#9EB39F] text-sm font-medium">vs</span>
              </div>
              <span className="text-[#F5C542] font-bold text-xl tracking-wide">
                {battle.loser}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#9EB39F]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">
                {truncateAddress(battle.player)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              <span>Battle {battle.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatTimeAgo(battle.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Battle Stats */}
        <div className="flex items-center gap-8 xl:flex-col xl:items-end xl:gap-4">
          <div className="text-center xl:text-right bg-[#26462F]/30 rounded-lg p-4 min-w-[120px]">
            <div className="flex items-center gap-2 text-[#00ff88] mb-2 justify-center xl:justify-end">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold text-lg">
                {battle.delta.toFixed(2)}%
              </span>
            </div>
            <div className="text-xs text-[#9EB39F] font-medium uppercase tracking-wider">
              Delta
            </div>
          </div>

          <div className="text-center xl:text-right bg-[#26462F]/30 rounded-lg p-4 min-w-[100px]">
            <div className="text-white font-bold text-lg mb-2">
              {battle.scoreA} - {battle.scoreB}
            </div>
            <div className="text-xs text-[#9EB39F] font-medium uppercase tracking-wider">
              Score
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PlayerCard = ({ player }) => (
    <div className="group bg-[#1a1f2e] border border-[#00ff88]/20 rounded-xl p-6 transition-all duration-300 hover:border-[#F5C542]/50 hover:shadow-lg hover:shadow-[#F5C542]/10 hover:scale-[1.01]">
      <div className="flex flex-col md:flex-row items-center  justify-between gap-6">
        {/* Player Info */}
        <div className="flex items-center gap-6 min-w-0">
          <div className="relative">
            <div className="flex items-center justify-center w-16 h-16 bg-[#26462F] rounded-xl border-2 border-[#00ff88]/30 transition-all group-hover:border-[#F5C542]/50">
              {getRankIcon(player.rank)}
            </div>
            {player.rank <= 3 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#F5C542] rounded-full flex items-center justify-center border-2 border-[#1a1f2e]">
                <span className="text-xs font-bold text-[#1a1f2e]">
                  {player.rank}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="font-bold text-white text-lg mb-1 tracking-wide">
              {truncateAddress(player.address)}
            </div>
            <div className="text-[#9EB39F] text-sm font-medium">
              Global Rank #{player.rank}
            </div>
          </div>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="bg-[#26462F]/30 rounded-lg p-4 min-w-[80px]">
            <div className="text-2xl font-bold text-[#00ff88] mb-1">
              {player.wins}
            </div>
            <div className="text-xs text-[#9EB39F] font-medium uppercase tracking-wider">
              Wins
            </div>
          </div>

          <div className="bg-[#26462F]/30 rounded-lg p-4 min-w-[80px]">
            <div className="text-2xl font-bold text-[#F5C542] mb-1">
              {player.winRate}%
            </div>
            <div className="text-xs text-[#9EB39F] font-medium uppercase tracking-wider">
              Win Rate
            </div>
          </div>

          <div className="bg-[#26462F]/30 rounded-lg p-4 min-w-[80px]">
            <div className="text-2xl font-bold text-[#00ff88] mb-1">
              {player.totalDelta.toFixed(1)}%
            </div>
            <div className="text-xs text-[#9EB39F] font-medium uppercase tracking-wider">
              Avg Delta
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Section */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="p-3 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl shadow-lg">
            <ChartBarIncreasingIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="heading-font text-3xl lg:text-4xl font-black text-[#F5C542] tracking-tight">
            BATTLE ARENA
          </h1>
        </div>
        <p className="text-[#9EB39F] text-lg font-medium max-w-2xl mx-auto">
          Track your performance, analyze battles, and climb the global rankings
        </p>
      </header>

      {/* User Stats Dashboard */}
      {userStats && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[#00ff88]" />
            <h2 className="text-2xl font-bold text-[#00ff88] uppercase tracking-wide">
              Your Performance
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Trophy}
              label="Wins"
              value={userStats.wins}
              color="text-[#00ff88]"
              bgColor="bg-[#1a1f2e]"
              borderColor="border-[#00ff88]/30"
            />
            <StatCard
              icon={Target}
              label="Losses"
              value={userStats.losses}
              color="text-[#ff6b6b]"
              bgColor="bg-[#1a1f2e]"
              borderColor="border-[#ff6b6b]/30"
            />
            <StatCard
              icon={TrendingUp}
              label="Win Rate"
              value={`${userStats.winRate}%`}
              color="text-[#F5C542]"
              bgColor="bg-[#1a1f2e]"
              borderColor="border-[#F5C542]/30"
            />
            <StatCard
              icon={Crown}
              label="Rank"
              value={`#${userStats.rank}`}
              color="text-[#00ff88]"
              bgColor="bg-[#1a1f2e]"
              borderColor="border-[#00ff88]/30"
            />
          </div>

          {/* Best Performance Highlight */}
          <div className="bg-gradient-to-r from-[#1a1f2e] to-[#26462F] border border-[#F5C542]/50 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C542]/5 rounded-full blur-3xl p-5" />
            <div className="relative flex items-center gap-4 mb-4">
              <Zap className="w-6 h-6 text-[#F5C542]" />
              <span className="text-[#F5C542] font-bold text-lg uppercase tracking-wide">
                Best Performance
              </span>
            </div>
            <div className="relative flex items-baseline gap-2">
              <span className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                {userStats.highestDelta.toFixed(2)}%
              </span>
              <span className="text-[#9EB39F] text-lg font-medium">
                Highest Delta Achieved
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Tab Navigation */}
      <nav className="flex gap-2 p-2 bg-[#1a1f2e] rounded-xl border border-[#00ff88]/20">
        {[
          { id: "recent", label: "Recent Battles", icon: Clock },
          { id: "leaderboard", label: "Top Players", icon: Trophy },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
              activeTab === id
                ? "bg-[#00ff88] text-[#1a1f2e] shadow-lg shadow-[#00ff88]/20"
                : "text-[#9EB39F] hover:text-[#00ff88] hover:bg-[#26462F]/50"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main className="bg-[#1a1f2e] border border-[#00ff88]/20 rounded-xl overflow-hidden">
        {/* Section Header */}
        <header className="flex items-center justify-between p-6 border-b border-[#00ff88]/20 bg-[#26462F]/30">
          <h3 className="text-[#00ff88] text-xl font-bold uppercase tracking-wide flex items-center gap-3">
            {activeTab === "recent" ? (
              <>
                <Clock className="w-6 h-6" />
                Recent Battles
              </>
            ) : (
              <>
                <Trophy className="w-6 h-6" />
                Top Players
              </>
            )}
          </h3>
          <button
            onClick={fetchLeaderboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#26462F] hover:bg-[#1a1f2e] border border-[#00ff88]/30 rounded-lg text-[#9EB39F] text-sm transition-all duration-300 disabled:opacity-50 hover:border-[#00ff88] hover:text-[#00ff88] disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 transition-transform duration-300 ${
                loading ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline font-medium">Refresh</span>
          </button>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h4 className="text-[#9EB39F] text-lg font-medium mb-2">
                Loading data...
              </h4>
              <p className="text-[#9EB39F]/70 text-sm">
                Fetching the latest battle information
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[#ff6b6b]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#ff6b6b]/20">
                <Target className="w-10 h-10 text-[#ff6b6b]" />
              </div>
              <h4 className="text-[#ff6b6b] text-lg font-medium mb-2">
                {error}
              </h4>
              <p className="text-[#9EB39F] text-sm mb-6">
                Please try again in a moment
              </p>
              <button
                onClick={fetchLeaderboardData}
                className="game-button px-6 py-3 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Recent Battles Tab */}
          {!loading && !error && activeTab === "recent" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {battles.length === 0 ? (
                <div className="text-center py-16">
                  <Trophy className="w-20 h-20 text-[#9EB39F]/50 mx-auto mb-6" />
                  <h4 className="text-[#9EB39F] text-xl font-medium mb-2">
                    No battles recorded yet
                  </h4>
                  <p className="text-[#9EB39F]/70 text-sm">
                    Be the first to submit a battle and make history!
                  </p>
                </div>
              ) : (
                battles.map((battle) => (
                  <BattleCard key={battle.id} battle={battle} />
                ))
              )}
            </div>
          )}

          {/* Top Players Tab */}
          {!loading && !error && activeTab === "leaderboard" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {mockTopPlayers.map((player) => (
                <PlayerCard key={player.rank} player={player} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LeaderBoard;
