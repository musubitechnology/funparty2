/*
  # Initial Schema Setup

  1. New Tables
    - `questers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `nickname` (text)
      - `points` (float)
      - `created_at` (timestamp)
    - `quests`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `points` (float)
      - `unlocked` (boolean)
      - `created_at` (timestamp)
    - `completed_quests`
      - `id` (uuid, primary key)
      - `quest_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Junction Table
    - `quest_participants`
      - `completed_quest_id` (uuid, foreign key)
      - `quester_id` (uuid, foreign key)

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Questers table
CREATE TABLE public.questers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    nickname text NOT NULL,
    points float DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.questers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to questers"
    ON public.questers
    FOR SELECT
    TO public
    USING (true);

-- Quests table
CREATE TABLE public.quests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL,
    points float NOT NULL,
    unlocked boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to quests"
    ON public.quests
    FOR SELECT
    TO public
    USING (true);

-- Completed quests table
CREATE TABLE public.completed_quests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quest_id uuid REFERENCES public.quests(id),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.completed_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to completed_quests"
    ON public.completed_quests
    FOR SELECT
    TO public
    USING (true);

-- Quest participants junction table
CREATE TABLE public.quest_participants (
    completed_quest_id uuid REFERENCES public.completed_quests(id),
    quester_id uuid REFERENCES public.questers(id),
    PRIMARY KEY (completed_quest_id, quester_id)
);

ALTER TABLE public.quest_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to quest_participants"
    ON public.quest_participants
    FOR SELECT
    TO public
    USING (true);

-- Insert initial quests
INSERT INTO public.quests (title, description, points) VALUES
    ('Draw your favorite animal', 'Using only your non-dominant hand, create a masterpiece!', 2),
    ('Sing Happy Birthday', 'Perform Happy Birthday in three different styles (opera, rap, whisper)', 3),
    ('Dance Challenge', 'Create and perform a 30-second dance routine', 4),
    ('Tongue Twister', 'Record yourself saying a difficult tongue twister 3 times fast', 2),
    ('Origami Master', 'Create an origami animal using only paper', 3),
    ('Mime Time', 'Act out a famous movie scene without speaking', 4),
    ('Poetry Slam', 'Write and perform a short poem about your day', 3),
    ('Shadow Puppets', 'Create a story using only shadow puppets', 3),
    ('Voice Acting', 'Read a paragraph using 3 different character voices', 2),
    ('Quick Sketch', 'Draw a portrait of someone in under 2 minutes', 2);