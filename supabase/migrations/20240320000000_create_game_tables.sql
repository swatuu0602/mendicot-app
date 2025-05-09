-- Create games table
CREATE TABLE games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('waiting', 'playing', 'finished')),
    current_player TEXT NOT NULL CHECK (current_player IN ('N', 'E', 'S', 'W')),
    dealer TEXT NOT NULL CHECK (dealer IN ('N', 'E', 'S', 'W')),
    trump_suit TEXT CHECK (trump_suit IN ('hearts', 'diamonds', 'clubs', 'spades')),
    trump_revealed BOOLEAN DEFAULT false,
    trump_owner TEXT CHECK (trump_owner IN ('N', 'E', 'S', 'W')),
    current_round INTEGER DEFAULT 1,
    captured_tens JSONB DEFAULT '{"NS": 0, "EW": 0}'::jsonb,
    tricks_won JSONB DEFAULT '{"NS": 0, "EW": 0}'::jsonb,
    rounds_won JSONB DEFAULT '{"NS": 0, "EW": 0}'::jsonb
);

-- Create players table
CREATE TABLE players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    position TEXT NOT NULL CHECK (position IN ('N', 'E', 'S', 'W')),
    team TEXT NOT NULL CHECK (team IN ('NS', 'EW')),
    is_ai BOOLEAN DEFAULT false,
    ai_difficulty TEXT CHECK (ai_difficulty IN ('easy', 'medium', 'hard')),
    hand JSONB DEFAULT '[]'::jsonb,
    UNIQUE(game_id, position)
);

-- Create tricks table
CREATE TABLE tricks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    trick_number INTEGER NOT NULL,
    leader TEXT NOT NULL CHECK (leader IN ('N', 'E', 'S', 'W')),
    cards JSONB NOT NULL,
    winner TEXT NOT NULL CHECK (winner IN ('N', 'E', 'S', 'W')),
    tens_captured INTEGER DEFAULT 0,
    UNIQUE(game_id, round_number, trick_number)
);

-- Create indexes
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_players_game_id ON players(game_id);
CREATE INDEX idx_tricks_game_id ON tricks(game_id);
CREATE INDEX idx_tricks_round ON tricks(game_id, round_number);

-- Enable Row Level Security (RLS)
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE tricks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON games
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON games
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON games
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Similar policies for players and tricks tables
CREATE POLICY "Enable read access for all users" ON players
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON players
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON players
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON tricks
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON tricks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON tricks
    FOR UPDATE USING (auth.role() = 'authenticated'); 