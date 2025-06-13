-- Habilitar Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medal_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medal_likes ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Los usuarios pueden ver todos los perfiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para values (solo lectura para todos)
CREATE POLICY "Todos pueden ver los valores" ON public.values
  FOR SELECT USING (true);

-- Políticas para medals
CREATE POLICY "Todos pueden ver reconocimientos públicos" ON public.medals
  FOR SELECT USING (is_public = true OR auth.uid() = giver_id OR auth.uid() = recipient_id);

CREATE POLICY "Los usuarios pueden crear reconocimientos" ON public.medals
  FOR INSERT WITH CHECK (auth.uid() = giver_id);

CREATE POLICY "Los usuarios pueden actualizar sus reconocimientos" ON public.medals
  FOR UPDATE USING (auth.uid() = giver_id);

-- Políticas para medal_comments
CREATE POLICY "Todos pueden ver comentarios de reconocimientos públicos" ON public.medal_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.medals 
      WHERE medals.id = medal_comments.medal_id 
      AND (medals.is_public = true OR medals.giver_id = auth.uid() OR medals.recipient_id = auth.uid())
    )
  );

CREATE POLICY "Los usuarios pueden crear comentarios" ON public.medal_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para medal_likes
CREATE POLICY "Todos pueden ver likes de reconocimientos públicos" ON public.medal_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.medals 
      WHERE medals.id = medal_likes.medal_id 
      AND (medals.is_public = true OR medals.giver_id = auth.uid() OR medals.recipient_id = auth.uid())
    )
  );

CREATE POLICY "Los usuarios pueden dar/quitar likes" ON public.medal_likes
  FOR ALL USING (auth.uid() = user_id);
