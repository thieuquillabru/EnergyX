#!/usr/bin/env python3
"""
EnergyX Audit Report - Comprehensive PDF Generator
Generates: /home/z/my-project/download/EnergyX_Audit_Report.pdf
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, Frame, PageTemplate,
    BaseDocTemplate, NextPageTemplate
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfgen import canvas

# ─── Font Registration ───────────────────────────────────────────────────────
FONT_DIR = '/usr/share/fonts/truetype/noto-serif-sc'
pdfmetrics.registerFont(TTFont('NotoSerifSC', os.path.join(FONT_DIR, 'NotoSerifSC-Regular.ttf')))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Bold', os.path.join(FONT_DIR, 'NotoSerifSC-Bold.ttf')))
pdfmetrics.registerFont(TTFont('NotoSerifSC-SemiBold', os.path.join(FONT_DIR, 'NotoSerifSC-SemiBold.ttf')))
registerFontFamily('NotoSerifSC', normal='NotoSerifSC', bold='NotoSerifSC-Bold', semiBold='NotoSerifSC-SemiBold')

# ─── Color Palette ──────────────────────────────────────────────────────────
PRIMARY = HexColor('#818cf8')
DARK_BG = HexColor('#0f172a')
TEXT_COLOR = HexColor('#f8fafc')
ACCENT_LIGHT = HexColor('#c7d2fe')
ACCENT_MID = HexColor('#6366f1')
DARK_SURFACE = HexColor('#1e293b')
DARK_BORDER = HexColor('#334155')
MUTED_TEXT = HexColor('#94a3b8')
SUCCESS_GREEN = HexColor('#4ade80')
WARN_AMBER = HexColor('#fbbf24')
ERROR_RED = HexColor('#f87171')
INFO_BLUE = HexColor('#60a5fa')

# ─── Dimensions ─────────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN = 20 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

# ─── Styles ──────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def make_style(name, **kwargs):
    defaults = dict(
        fontName='NotoSerifSC',
        fontSize=10,
        leading=16,
        textColor=TEXT_COLOR,
        alignment=TA_JUSTIFY,
    )
    defaults.update(kwargs)
    return ParagraphStyle(name, **defaults)

style_body = make_style('BodyCustom', fontSize=10, leading=17, spaceAfter=6)
style_h1 = make_style('H1Custom', fontName='NotoSerifSC-Bold', fontSize=20, leading=28,
                       textColor=PRIMARY, spaceBefore=18, spaceAfter=10, alignment=TA_LEFT)
style_h2 = make_style('H2Custom', fontName='NotoSerifSC-Bold', fontSize=14, leading=20,
                       textColor=ACCENT_LIGHT, spaceBefore=14, spaceAfter=8, alignment=TA_LEFT)
style_h3 = make_style('H3Custom', fontName='NotoSerifSC-SemiBold', fontSize=11.5, leading=17,
                       textColor=PRIMARY, spaceBefore=10, spaceAfter=6, alignment=TA_LEFT)
style_bullet = make_style('BulletCustom', fontSize=10, leading=16, leftIndent=18,
                           bulletIndent=6, spaceAfter=4, alignment=TA_LEFT)
style_toc_h1 = make_style('TOCH1', fontName='NotoSerifSC-Bold', fontSize=12, leading=22,
                          textColor=TEXT_COLOR, leftIndent=0)
style_toc_h2 = make_style('TOCH2', fontName='NotoSerifSC', fontSize=10.5, leading=20,
                          textColor=MUTED_TEXT, leftIndent=20)
style_cover_title = make_style('CoverTitle', fontName='NotoSerifSC-Bold', fontSize=36, leading=44,
                               textColor=PRIMARY, alignment=TA_CENTER, spaceAfter=10)
style_cover_sub = make_style('CoverSub', fontName='NotoSerifSC', fontSize=16, leading=24,
                             textColor=ACCENT_LIGHT, alignment=TA_CENTER, spaceAfter=6)
style_cover_date = make_style('CoverDate', fontName='NotoSerifSC', fontSize=12, leading=18,
                              textColor=MUTED_TEXT, alignment=TA_CENTER)
style_phase_num = make_style('PhaseNum', fontName='NotoSerifSC-Bold', fontSize=11, leading=16,
                             textColor=PRIMARY, spaceBefore=6, spaceAfter=2)
style_note = make_style('NoteStyle', fontSize=9, leading=14, textColor=MUTED_TEXT,
                        leftIndent=10, spaceBefore=4, spaceAfter=4)
style_table_header = make_style('TableHeader', fontName='NotoSerifSC-Bold', fontSize=9.5,
                                leading=14, textColor=white, alignment=TA_CENTER)
style_table_cell = make_style('TableCell', fontSize=9, leading=14, textColor=TEXT_COLOR,
                              alignment=TA_LEFT)
style_table_cell_c = make_style('TableCellC', fontSize=9, leading=14, textColor=TEXT_COLOR,
                                alignment=TA_CENTER)
style_score = make_style('ScoreStyle', fontName='NotoSerifSC-Bold', fontSize=48, leading=56,
                         textColor=PRIMARY, alignment=TA_CENTER, spaceBefore=10)
style_footer = make_style('FooterStyle', fontName='NotoSerifSC', fontSize=8, leading=12,
                          textColor=MUTED_TEXT, alignment=TA_CENTER)

# ─── Helper Functions ────────────────────────────────────────────────────────

def bullet(text):
    return Paragraph(f'<bullet>&bull;</bullet> {text}', style_bullet)

def phase_heading(num, title):
    return [
        Paragraph(f'Phase {num}', style_phase_num),
        Paragraph(title, style_h1),
        HRFlowable(width='100%', thickness=0.8, color=PRIMARY, spaceAfter=8),
    ]

def section(text):
    return Paragraph(text, style_h2)

def subsection(text):
    return Paragraph(text, style_h3)

def body(text):
    return Paragraph(text, style_body)

def note(text):
    return Paragraph(f'<i>{text}</i>', style_note)

def spacer(h=6):
    return Spacer(1, h * mm)

def make_table(headers, rows, col_widths=None):
    """Create a styled table with dark theme."""
    header_paras = [Paragraph(h, style_table_header) for h in headers]
    data = [header_paras]
    for row in rows:
        data.append([Paragraph(str(c), style_table_cell) for c in row])
    
    if col_widths is None:
        col_widths = [CONTENT_W / len(headers)] * len(headers)
    
    t = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), DARK_SURFACE),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'NotoSerifSC-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9.5),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 0.4, DARK_BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
    ]
    # Alternate row colors
    for i in range(1, len(data)):
        if i % 2 == 0:
            style_cmds.append(('BACKGROUND', (0, i), (-1, i), DARK_SURFACE))
    t.setStyle(TableStyle(style_cmds))
    return t

# ─── Custom Page Templates ───────────────────────────────────────────────────

def cover_page(canvas_obj, doc):
    """Draw the cover page background."""
    canvas_obj.saveState()
    # Full page dark background
    canvas_obj.setFillColor(DARK_BG)
    canvas_obj.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # Accent line at top
    canvas_obj.setStrokeColor(PRIMARY)
    canvas_obj.setLineWidth(3)
    canvas_obj.line(MARGIN, PAGE_H - 40*mm, PAGE_W - MARGIN, PAGE_H - 40*mm)
    # Decorative geometric shapes
    canvas_obj.setFillColor(Color(0.506, 0.549, 0.973, 0.06))  # Primary at 6% opacity
    canvas_obj.circle(PAGE_W * 0.85, PAGE_H * 0.75, 120, fill=1, stroke=0)
    canvas_obj.circle(PAGE_W * 0.15, PAGE_H * 0.25, 80, fill=1, stroke=0)
    # Bottom accent line
    canvas_obj.setStrokeColor(PRIMARY)
    canvas_obj.setLineWidth(1.5)
    canvas_obj.line(MARGIN, 50*mm, PAGE_W - MARGIN, 50*mm)
    canvas_obj.restoreState()

def body_page(canvas_obj, doc):
    """Draw body page background with header and footer."""
    canvas_obj.saveState()
    # Dark background
    canvas_obj.setFillColor(DARK_BG)
    canvas_obj.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # Header line
    canvas_obj.setStrokeColor(PRIMARY)
    canvas_obj.setLineWidth(1)
    canvas_obj.line(MARGIN, PAGE_H - 18*mm, PAGE_W - MARGIN, PAGE_H - 18*mm)
    # Header text
    canvas_obj.setFillColor(MUTED_TEXT)
    canvas_obj.setFont('NotoSerifSC', 7.5)
    canvas_obj.drawString(MARGIN, PAGE_H - 16*mm, 'Audit Complet EnergyX -- Rapport Final')
    canvas_obj.drawRightString(PAGE_W - MARGIN, PAGE_H - 16*mm, '28 juillet 2026')
    # Footer
    canvas_obj.setStrokeColor(DARK_BORDER)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(MARGIN, 16*mm, PAGE_W - MARGIN, 16*mm)
    canvas_obj.setFillColor(MUTED_TEXT)
    canvas_obj.setFont('NotoSerifSC', 7.5)
    canvas_obj.drawCentredString(PAGE_W / 2, 10*mm, f'-- {doc.page} --')
    canvas_obj.restoreState()

# ─── Build Document ──────────────────────────────────────────────────────────

OUTPUT_PATH = '/home/z/my-project/download/EnergyX_Audit_Report.pdf'

doc = BaseDocTemplate(
    OUTPUT_PATH,
    pagesize=A4,
    leftMargin=MARGIN,
    rightMargin=MARGIN,
    topMargin=24*mm,
    bottomMargin=22*mm,
    title='Audit Complet EnergyX -- Rapport Final',
    author='EnergyX Audit Team',
    subject='Audit complet en 13 phases de l\'application EnergyX',
)

frame_cover = Frame(MARGIN, 50*mm, CONTENT_W, PAGE_H - 100*mm, id='cover_frame')
frame_body = Frame(MARGIN, 22*mm, CONTENT_W, PAGE_H - 46*mm, id='body_frame')

doc.addPageTemplates([
    PageTemplate(id='cover', frames=frame_cover, onPage=cover_page),
    PageTemplate(id='body', frames=frame_body, onPage=body_page),
])

# ─── Story ───────────────────────────────────────────────────────────────────
story = []

# ═══════════════════════════════════════════════════════════════════════════════
# COVER PAGE
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Spacer(1, 30*mm))
story.append(Paragraph('Audit Complet EnergyX', style_cover_title))
story.append(Spacer(1, 6*mm))
story.append(Paragraph("Rapport d'audit en 13 phases", style_cover_sub))
story.append(Spacer(1, 4*mm))
story.append(HRFlowable(width='40%', thickness=1.5, color=PRIMARY, spaceAfter=12, spaceBefore=4))
story.append(Paragraph('28 juillet 2026', style_cover_date))
story.append(NextPageTemplate('body'))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# TABLE OF CONTENTS
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph('Table des matieres', style_h1))
story.append(HRFlowable(width='100%', thickness=0.8, color=PRIMARY, spaceAfter=10))

toc_entries = [
    ('Phase 1', 'Comprehension du projet'),
    ('Phase 2', 'Analyse de l\'architecture'),
    ('Phase 3', 'Bugs corriges'),
    ('Phase 4', 'Tests fonctionnels'),
    ('Phase 5', 'Audit Frontend'),
    ('Phase 6', 'Audit Backend'),
    ('Phase 7', 'Securite'),
    ('Phase 8', 'Performance'),
    ('Phase 9', 'Stockage'),
    ('Phase 10', 'Experience Utilisateur (UX)'),
    ('Phase 11', 'Qualite du code'),
    ('Phase 12', 'Corrections validees'),
    ('Phase 13', 'Synthese et recommandations'),
]
for phase, title in toc_entries:
    story.append(Paragraph(
        f'<b>{phase}</b>  --  {title}',
        style_toc_h1 if 'Phase' in phase else style_toc_h2
    ))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 1 - Comprehension du projet
# ═══════════════════════════════════════════════════════════════════════════════
story.extend(phase_heading(1, 'Comprehension du projet'))

story.append(body(
    "EnergyX est une application web de type Single Page Application (SPA) construite avec le framework "
    "Next.js 16 en mode standalone. Le projet comprend un total de 14 pages distinctes couvrant "
    "l'ensemble des fonctionnalites de gestion d'energie personnelle, incluant le suivi de productivite, "
    "la gestion des taches, le suivi du temps via un timer Pomodoro integre, la journalisation quotidienne, "
    "ainsi qu'un systeme de gamification base sur l'experience (XP) et les niveaux de progression."
))

story.append(body(
    "L'architecture technique repose sur un stack moderne comprenant React comme bibliotheque d'interface, "
    "Tailwind CSS version 4 pour le systeme de stylage utilitaire, et le composant shadcn/ui pour les "
    "elements d'interface utilisateur reutilisables. L'ensemble des donnees est persiste cote client "
    "exclusivement via le mecanisme localStorage du navigateur, sans aucune dependance a un serveur "
    "backend ou a une base de donnees distante. Cette approche confere a l'application une simplicite "
    "de deploiement remarquable, permettant un hebergement statique sur GitHub Pages.""
))

story.append(body(
    "Le flux de donnees suit un modele unidirectionnel clair : les donnees sont lues depuis localStorage "
    "au demarrage de l'application, injectees dans un React Context central (AppContext) qui sert de "
    "store unique, puis distribuees aux 14 pages composant l'interface. Chaque modification effectuee "
    "par l'utilisateur met a jour le contexte, qui synchronise automatiquement les changements vers "
    "localStorage. Il n'existe aucune route API, aucun middleware serveur, et aucune logique backend. "
    "L'application est entierement autonome et fonctionnelle dans un environnement de navigateur "
    "moderne, sans necessite de connexion internet une fois les assets statiques charges.""
))

story.append(section('Stack technique'))
story.append(make_table(
    ['Technologie', 'Version', 'Role'],
    [
        ['Next.js', '16', 'Framework SPA (mode standalone)'],
        ['React', '19', 'Bibliotheque d\'interface utilisateur'],
        ['TypeScript', '5.x', 'Typage statique'],
        ['Tailwind CSS', '4', 'Systeme de stylage utilitaire'],
        ['shadcn/ui', 'latest', 'Composants UI reutilisables'],
        ['localStorage', 'Web API', 'Persistance des donnees cote client'],
        ['React Context', 'API native', 'Store central (AppContext)'],
        ['GitHub Pages', '-', 'Hebergement statique'],
    ],
    col_widths=[80, 55, CONTENT_W - 135]
))
story.append(spacer(4))

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 2 - Analyse Architecture
# ═══════════════════════════════════════════════════════════════════════════════
story.extend(phase_heading(2, "Analyse de l'architecture"))

story.append(body(
    "L'architecture d'EnergyX peut etre qualifiee de monolithique front-end : l'ensemble de la logique "
    "metier, la gestion d'etat, et le rendu visuel sont contenus dans une seule application Next.js. "
    "Cependant, cette monolithie est bien structuree grace a une organisation modulaire des composants "
    "et a une separation claire entre les pages, les composants reutilisables, et le contexte global. "
    "Le React Context (AppContext) joue le role de store central, regroupant l'ensemble des etats "
    "de l'application et les fonctions de manipulation associees. Ce pattern, bien que simple, "
    "s'avere adequat pour la taille actuelle du projet et le volume de donnees gerees.""
))

story.append(body(
    "Les 14 pages de l'application couvrent un spectre complet de fonctionnalites CRUD : creation, "
    "lecture, mise a jour et suppression d'entites telles que les taches, les projets, les categories, "
    "les entrees du journal, et les sessions Pomodoro. Chaque page suit un schema de conception "
    "coherent avec des formulaires de saisie, des listes filtrables, et des actions contextuelles. "
    "La coherence typographique et le systeme de thematisation global garantissent une experience "
    "utilisateur homogene a travers toutes les pages de l'application.""
))

story.append(section('Points forts identifies'))
story.append(bullet('Cohérence architecturale globale avec un pattern React Context bien maitrise'))
story.append(bullet('Typage TypeScript rigoureux couvrant l\'ensemble des entites et des operations'))
story.append(bullet('Organisation modulaire des composants avec une separation pages/composants/contexte'))
story.append(bullet('Systeme de thematisation a 8 themes predefinis plus un createur de themes personnalises'))

story.append(section('Points faibles identifies'))
story.append(bullet('Couplage fort au contexte global : chaque composant depend directement d\'AppContext'))
story.append(bullet('Absence de séparation entre la couche de donnees et la couche logique metier'))
story.append(bullet('Pas de gestion d\'etat segmentee : tout passe par un seul contexte, ce qui peut engendrer des re-rendus non necessaires'))
story.append(bullet('Absence de middlewares ou de side-effects pour les operations asynchrones'))

story.append(spacer(4))

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 3 - Bugs Corriges
# ═══════════════════════════════════════════════════════════════════════════════
story.extend(phase_heading(3, 'Bugs corriges'))

story.append(body(
    "L'audit a permis d'identifier et de corriger six bugs distincts dans le codebase d'EnergyX. "
    "Ces bugs, bien que n'affectant pas catastrophiquement l'experience utilisateur, representaient "
    "des dysfonctionnements notables qui pouvaient induire des comportements inattendus ou "
    "degrader la qualite percue de l'application. Chaque correction a ete validee par des tests "
    "fonctionnels specifiques et integree dans le depot de code source.""
))

story.append(make_table(
    ['Bug', 'Description', 'Correction appliquee'],
    [
        ['Service Worker',
         'Le fichier de service worker ne prenait pas en compte le basePath de deploiement, causant des erreurs 404 sur les assets en production.',
         'Utilisation de la variable d\'environnement NEXT_PUBLIC_BASE_PATH pour construire les chemins absolus des ressources.'],
        ['weekStart ignore',
         'Le parametre weekStart (lundi/dimanche) etait defini dans les parametres mais le Dashboard l\'ignorait et utilisait toujours le lundi comme premier jour.',
         'Le Dashboard respecte maintenant la valeur de weekStart stockee dans les parametres utilisateur.'],
        ['XP_PER_LEVEL hardcode',
         'La constante XP_PER_LEVEL etait hardcodee a 500 dans le composant de progression au lieu d\'utiliser la valeur centralisee.',
         'Import de la constante depuis le module de configuration et utilisation uniforme.'],
        ['TimerIcon inutilise',
         'Un import de TimerIcon etait present dans un composant sans etre utilise, augmentant inutilement les dependances.',
         'Suppression de l\'import inutilise.'],
        ['Variable sorted',
         'Une variable nommee \'sorted\' etait calculee mais jamais utilisee dans le flux de donnees.',
         'Suppression du code mort correspondant.'],
        ['Import format',
         'Un import de la fonction format etait present mais jamais reference dans le module.',
         'Suppression de l\'import non utilise.'],
    ],
    col_widths=[65, CONTENT_W*0.40, CONTENT_W - 65 - CONTENT_W*0.40]
))
story.append(spacer(2))
story.append(note('Toutes les corrections ont ete validees par un build Next.js sans erreur et un deploiement successful sur GitHub Pages.'))
story.append(spacer(4))

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 4 - Tests Fonctionnels
# ═══════════════════════════════════════════════════════════════════════════════
story.extend(phase_heading(4, 'Tests fonctionnels'))

story.append(body(
    "L'ensemble des fonctionnalites principales d'EnergyX a ete soumis a des tests fonctionnels "
    "manuels approfondis. La navigation SPA a ete verifiee sur l'ensemble des 14 pages, confirmant "
    "que les transitions entre pages fonctionnent correctement sans rechargement complet du navigateur. "
    "Le routing Next.js assure une navigation fluide avec préservation de l'etat applicatif entre "
    "les changements de page, ce qui est essentiel pour une experience utilisateur de qualite dans "
    "le contexte d'une application de productivite ou l'utilisateur navigue frequemment entre "
    "differentes vues.""
))

story.append(body(
    "Les operations CRUD ont ete testees sur toutes les entites de l'application : taches, projets, "
    "categories, entrees du journal, sessions Pomodoro, et objectifs. Chaque operation de creation, "
    "lecture, mise a jour et suppression a ete verifiee avec succes. Le timer Pomodoro a ete teste "
    "en conditions reelles, confirmant le bon fonctionnement des phases de travail et de pause, "
    "ainsi que la persistence correcte des sessions terminees dans localStorage. Le mecanisme d'upsert "
    "du journal a egalement ete valide : la modification d'une entree existante met a jour l'entree "
    "en place plutot que d'en creer une nouvelle, evitant ainsi la duplication de donnees.""
))

story.append(body(
    "Les fonctionnalites d'import et d'export JSON ont ete testees avec des jeux de donnees "
    "varies, confirmant la capacite de l'application a sauvegarder et restaurer l'ensemble de "
    "ses donnees. Un bug a ete detecte et corrige dans le composant CalendarView qui ne permettait "
    "pas la navigation entre les mois. Cette correction a ete integree et validee. Aucune "
    "regression n'a ete detectee suite aux corrections appliquees lors des phases precedentes.""
))

story.append(make_table(
    ['Fonctionnalite', 'Statut', 'Remarque'],
    [
        ['Navigation SPA', 'OK', '14 pages, transitions fluides'],
        ['CRUD Taches', 'OK', 'Create, Read, Update, Delete'],
        ['CRUD Projets', 'OK', 'Gestion complete des projets'],
        ['CRUD Categories', 'OK', 'Categorisation fonctionnelle'],
        ['Timer Pomodoro', 'OK', 'Phases travail/pause, persistance'],
        ['Journal (upsert)', 'OK', 'Mise a jour en place sans duplication'],
        ['Import/Export JSON', 'OK', 'Sauvegarde et restauration'],
        ['CalendarView', 'Corrige', 'Navigation inter-mois restauree'],
    ],
    col_widths=[100, 60, CONTENT_W - 160]
))
story.append(spacer(4))

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 5 - Frontend
# ═══════════════════════════════════════════════════════════════════════════════
story.extend(phase_heading(5, 'Audit Frontend'))

story.append(body(
    "L'interface utilisateur d'EnergyX presente une coherence visuelle remarquable sur l'ensemble "
    "des 14 pages. Le systeme de thematisation, base sur Tailwind CSS 4 et les composants shadcn/ui, "
    "assure une harmonie graphique constante. L'application est responsive et s'adapte correctement "
    "aux differentes tailles d'ecran grace a l'utilisation coherente du breakpoint 'md' comme point "
    "de bascule entre les layouts mobile et desktop. Les composants skeletons sont utilises pour "
    "les etats de chargement, minimisant le Cumulative Layout Shift (CLS) et ameliorant la "
    "perception de performance par l'utilisateur.""
))

story.append(body(
    "Huit themes predefinis sont disponibles, couvrant un large spectre de preferences visuelles, "
    "du clair au sombre, en passant par des variantes colorees. Un createur de themes personnalises "
    "permet egalement aux utilisateurs de definir leurs propres palettes de couleurs. Les composants "
    "shadcn/ui sont utilises de maniere uniforme a travers l'application, garantissant une "
    "coherence dans les interactions et les retours visuels. Aucune erreur de rendu n'a ete "
    "detectee lors de l'audit, et tous les aria-labels necessaires sont presents sur les boutons "
    "d'action, contribuant a une accessibilite satisfaisante pour un MVP.""
))

story.append(section('Elements d\'interface verifies'))
story.append(bullet('Cohérence visuelle sur les 14 pages avec un design system unifie'))
story.append(bullet('Responsive design fonctionnel avec breakpoint md pour la bascule mobile/desktop'))
story.append(bullet('Skeleton loading sur toutes les vues principales, reduisant le CLS'))
story.append(bullet('8 themes predefinis + createur de themes personnalises'))
story.append(bullet('Aria-labels presents sur les boutons d\'action pour l\'accessibilite'))
story.append(bullet('Aucune erreur de rendu detectee dans la console du navigateur'))
story.append(spacer(4))

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 6 - Backend
# ═══════════════════════════════════════════════════════════════════════════════
story.extend(phase_heading(6, 'Audit Backend'))

story.append(body(
    "EnergyX est une application 100% cote client (client-side only). Il n'existe aucun backend, "
    "aucune route API, aucun serveur d'application, et aucune base de donnees cote serveur. "
    "L'ensemble de la persistance des donnees repose exclusivement sur le mecanisme localStorage "
    "du navigateur web. Cette architecture, bien que limitante en termes de fonctionnalites, "
    "presente l'avantage considerable de simplifier drastiquement le deploiement et la maintenance. "
    "L'application peut etre hebergee comme un ensemble de fichiers statiques sur n'importe quel "
    "serveur web ou service de CDN, sans necessite de configuration serveur.""
))

story.append(body(
    "L'absence de backend signifie egalement qu'il n'y a pas de points d'entree vulnerables "
    "typiquement associes aux applications web serveur (injection SQL, failles d'authentification, "
    "escalade de privileges, etc.). Cependant, cela implique egalement l'absence de synchronisation "
    