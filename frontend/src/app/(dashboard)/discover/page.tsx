'use client';

import * as React from 'react';
import {
  Box, Button, Chip, Divider, FormControl, IconButton, InputAdornment, Menu,
  MenuItem, Paper, Popover, Select, Stack, Tab, Tabs, TextField, Tooltip,
  Typography, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem,
  ListItemText, Checkbox, Slider, Switch, FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import SortIcon from '@mui/icons-material/Sort';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TableViewIcon from '@mui/icons-material/TableView';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTheme, alpha } from '@mui/material/styles';
import { mockLogs } from '@/mock/discover.mock';
import type { LogEntry } from '@/types/discover.types';
import { fontMono } from '@/theme/typography';
import { formatTime } from '@/utils/formatDate';
import { useTranslation } from '@/i18n/useTranslation';
import { usePageTitle } from '@/hooks/usePageTitle';
import { InspectDialog } from '@/components/discover/inspect';

type Filter = { id: string; field: string; operator: '=' | '!='; value: string; enabled: boolean };
type DiscoverTab = {
  id: string;
  title: string;
  query: string;
  dataView: string;
  timeRange: string;
  filters: Filter[];
  columns: string[];
  sort: { field: keyof LogEntry; direction: 'asc' | 'desc' };
};

const ALL_COLUMNS = ['timestamp', 'level', 'service', 'host', 'message'] as const;
const COLUMN_LABELS: Record<string, string> = {
  timestamp: 'Time', level: 'Level', service: 'Service', host: 'Host', message: 'Message'
};

const seedTab = (id: string, title: string): DiscoverTab => ({
  id, title, query: '', dataView: 'logs-*', timeRange: 'Last 15 minutes',
  filters: [], columns: [...ALL_COLUMNS], sort: { field: 'timestamp', direction: 'desc' }
});

function MiniHistogram({ data }: { data: number[] }) {
  const theme = useTheme();
  const max = Math.max(...data, 1);
  return (
    <Box sx={{ height: 132, px: 1.5, pt: 1, display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
      {data.map((v, i) => (
        <Box key={i} sx={{
          flex: 1, minWidth: 2, height: `${Math.max(4, (v / max) * 100)}%`,
          bgcolor: alpha(theme.palette.primary.main, i > data.length - 7 ? 0.9 : 0.55),
          borderRadius: '2px 2px 0 0'
        }} />
      ))}
    </Box>
  );
}

function FieldPopover({
  field, onClose, onAdd, anchorEl
}: { field: string; onClose: () => void; onAdd: (field: string) => void; anchorEl: HTMLElement | null }) {
  const values = React.useMemo(() => {
    const counts = new Map<string, number>();
    mockLogs.forEach(l => {
      const v = String(l[field as keyof LogEntry] ?? '');
      counts.set(v, (counts.get(v) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a,b) => b[1]-a[1]).slice(0, 5);
  }, [field]);
  return (
    <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
      <Box sx={{ width: 300, p: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontFamily: fontMono }}>{field}</Typography>
        <Typography variant="caption" color="text.secondary">Top values</Typography>
        <Stack spacing={0.5} sx={{ mt: 1 }}>
          {values.map(([v,c]) => <Box key={v} sx={{ display:'flex', justifyContent:'space-between', gap:2 }}>
            <Typography variant="body2" noWrap>{v}</Typography><Typography variant="caption" color="text.secondary">{c}</Typography>
          </Box>)}
        </Stack>
        <Divider sx={{ my: 1 }} />
        <Button size="small" startIcon={<AddIcon />} onClick={() => { onAdd(field); onClose(); }}>Add to table</Button>
      </Box>
    </Popover>
  );
}

export default function DiscoverPage() {
  const { t, dir } = useTranslation();
  usePageTitle(t.discover.title);
  const [tabs, setTabs] = React.useState<DiscoverTab[]>([seedTab('tab-1', 'Discover')]);
  const [activeId, setActiveId] = React.useState('tab-1');
  const [query, setQuery] = React.useState('');
  const [levelMenu, setLevelMenu] = React.useState<HTMLElement | null>(null);
  const [fieldSearch, setFieldSearch] = React.useState('');
  const [fieldAnchor, setFieldAnchor] = React.useState<HTMLElement | null>(null);
  const [selectedField, setSelectedField] = React.useState('');
  const [columnOpen, setColumnOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);
  const [displayOpen, setDisplayOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [document, setDocument] = React.useState<LogEntry | null>(null);
  const [documentMode, setDocumentMode] = React.useState<'table'|'json'>('table');
  const [inspectOpen, setInspectOpen] = React.useState(false);
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [mode, setMode] = React.useState<'classic'|'esql'>('classic');
  const [density, setDensity] = React.useState<'compact'|'normal'|'expanded'>('compact');
  const [chartVisible, setChartVisible] = React.useState(true);
  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  const [newFilterField, setNewFilterField] = React.useState('service');
  const [newFilterValue, setNewFilterValue] = React.useState('');
  const [newFilterOp, setNewFilterOp] = React.useState<'='|'!='>('=');
  const [rows, setRows] = React.useState(25);

  const active = tabs.find(x => x.id === activeId) ?? tabs[0]!;
  React.useEffect(() => {
    if (!active) return;
    setQuery(active.query);
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateActive = (patch: Partial<DiscoverTab>) =>
    setTabs(prev => prev.map(tab => tab.id === activeId ? { ...tab, ...patch } : tab));

  const addTab = (duplicate = false) => {
    const id = `tab-${Date.now()}`;
    const next = duplicate && active ? { ...active, id, title: `${active.title} copy`, filters: active.filters.map(f => ({...f})), columns: [...active.columns] } : seedTab(id, `Discover ${tabs.length + 1}`);
    setTabs(prev => [...prev, next]); setActiveId(id);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;
    const idx = tabs.findIndex(t => t.id === id);
    const next = tabs.filter(t => t.id !== id);
    setTabs(next);
    if (id === activeId) {
      const nextActive = next[Math.max(0, idx - 1)];
      if (nextActive) setActiveId(nextActive.id);
    }
  };

  const runQuery = () => updateActive({ query });
  const addFilter = () => {
    if (!newFilterValue.trim()) return;
    const filter: Filter = { id: String(Date.now()), field: newFilterField, operator: newFilterOp, value: newFilterValue.trim(), enabled: true };
    updateActive({ filters: [...active.filters, filter] });
    setNewFilterValue(''); setFilterOpen(false);
  };
  const removeFilter = (id: string) => updateActive({ filters: active.filters.filter(f => f.id !== id) });

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...mockLogs].filter(log => {
      if (q && !`${log.message} ${log.service} ${log.host} ${log.level}`.toLowerCase().includes(q)) return false;
      return active.filters.every(f => {
        if (!f.enabled) return true;
        const value = String(log[f.field as keyof LogEntry] ?? '').toLowerCase();
        return f.operator === '=' ? value.includes(f.value.toLowerCase()) : !value.includes(f.value.toLowerCase());
      });
    }).sort((a,b) => {
      const av = String(a[active.sort.field]), bv = String(b[active.sort.field]);
      return active.sort.direction === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [query, active]);

  const fieldNames = ALL_COLUMNS.filter(f => f.includes(fieldSearch.toLowerCase()));
  const histogram = Array.from({length: 36}, (_, i) => 4 + ((i * 17 + filtered.length * 3) % 18));

  const renameTab = () => {
    const title = window.prompt('Tab name', active.title);
    if (title?.trim()) updateActive({ title: title.trim() });
  };

  return (
    <Box dir={dir} sx={{ minWidth: 0 }}>
      {/* Discover header */}
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:1.5, gap:1, flexWrap:'wrap' }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 650 }}>{t.discover.title}</Typography>
          <Typography variant="caption" color="text.secondary">{t.discover.subtitle}</Typography>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Save"><IconButton size="small" onClick={() => setSaveOpen(true)}><SaveOutlinedIcon fontSize="small"/></IconButton></Tooltip>
          <Tooltip title="Share"><IconButton size="small" onClick={() => setShareOpen(true)}><ShareOutlinedIcon fontSize="small"/></IconButton></Tooltip>
          <Tooltip title="Inspect"><IconButton size="small" onClick={() => setInspectOpen(true)}><CodeOutlinedIcon fontSize="small"/></IconButton></Tooltip>
        </Stack>
      </Box>

      {/* Tabs */}
      <Paper variant="outlined" sx={{ borderRadius:1, mb:1 }}>
        <Box sx={{ display:'flex', alignItems:'center', minWidth:0 }}>
          <Tabs value={activeId} onChange={(_,v) => setActiveId(v)} variant="scrollable" scrollButtons="auto"
            sx={{ minHeight:40, flex:1, '& .MuiTab-root': { minHeight:40, py:0, textTransform:'none', fontSize:12 } }}>
            {tabs.map(tab => <Tab key={tab.id} value={tab.id} label={
              <Box sx={{ display:'flex', alignItems:'center', gap:.5 }}>
                {tab.title}
                {tabs.length > 1 && <IconButton size="small" onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} sx={{ p:.15 }}><CloseIcon sx={{fontSize:13}}/></IconButton>}
              </Box>
            } />)}
          </Tabs>
          <Tooltip title="New tab"><IconButton size="small" onClick={() => addTab()}><AddIcon fontSize="small"/></IconButton></Tooltip>
          <Tooltip title="Tab actions"><IconButton size="small" onClick={(e)=>setLevelMenu(e.currentTarget)}><MoreVertIcon fontSize="small"/></IconButton></Tooltip>
        </Box>
      </Paper>
      <Menu anchorEl={levelMenu} open={Boolean(levelMenu)} onClose={()=>setLevelMenu(null)}>
        <MenuItem onClick={()=>{addTab(true);setLevelMenu(null)}}><ContentCopyIcon fontSize="small" sx={{mr:1}}/>Duplicate tab</MenuItem>
        <MenuItem onClick={()=>{renameTab();setLevelMenu(null)}}>Rename tab</MenuItem>
        <MenuItem onClick={()=>{tabs.filter(x=>x.id!==activeId).forEach(x=>closeTab(x.id));setLevelMenu(null)}} disabled={tabs.length===1}>Close other tabs</MenuItem>
        <MenuItem onClick={()=>{closeTab(activeId);setLevelMenu(null)}} disabled={tabs.length===1}>Close tab</MenuItem>
      </Menu>

      {/* Query controls */}
      <Paper variant="outlined" sx={{ p:1, mb:1 }}>
        <Stack direction={{xs:'column', md:'row'}} spacing={1} sx={{alignItems:{md:'center'}}}>
          <FormControl size="small" sx={{ minWidth:170 }}>
            <Select value={mode} onChange={e=>setMode(e.target.value as 'classic'|'esql')} displayEmpty>
              <MenuItem value="classic">Classic / KQL</MenuItem>
              <MenuItem value="esql">ES|QL</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth:190 }}>
            <Select value={active.dataView} onChange={e=>updateActive({dataView:e.target.value})} displayEmpty>
              <MenuItem value="logs-*">logs-*</MenuItem><MenuItem value="app-logs-*">app-logs-*</MenuItem><MenuItem value="audit-*">audit-*</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth size="small" value={query}
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter')runQuery()}}
            placeholder={mode==='classic' ? 'KQL: service : "checkout-service" or level : error' : 'FROM logs-* | WHERE level == "error"'}
            slotProps={{ input: { startAdornment:<InputAdornment position="start"><SearchIcon fontSize="small"/></InputAdornment>, endAdornment:<InputAdornment position="end"><Chip size="small" label={mode==='classic'?'KQL':'ES|QL'} variant="outlined"/></InputAdornment> } }}
          />
          <Tooltip title="Run query"><IconButton color="primary" onClick={runQuery}><PlayArrowIcon/></IconButton></Tooltip>
          <Tooltip title="Refresh"><IconButton onClick={()=>setQuery(q=>q)}><RefreshIcon/></IconButton></Tooltip>
          <Button size="small" variant="outlined" startIcon={<FilterAltOutlinedIcon/>} onClick={()=>setFilterOpen(true)}>Add filter</Button>
          <FormControl size="small" sx={{minWidth:145}}>
            <Select value={active.timeRange} onChange={e=>updateActive({timeRange:e.target.value})} startAdornment={<AccessTimeIcon sx={{fontSize:17, mr:.5}}/>}>
              <MenuItem value="Last 15 minutes">Last 15 minutes</MenuItem><MenuItem value="Last 1 hour">Last 1 hour</MenuItem><MenuItem value="Last 24 hours">Last 24 hours</MenuItem><MenuItem value="Last 7 days">Last 7 days</MenuItem><MenuItem value="Custom">Custom…</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Filter bar */}
      {active.filters.length > 0 && <Box sx={{display:'flex',alignItems:'center',gap:.75,mb:1,flexWrap:'wrap'}}>
        {active.filters.map(f => <Chip key={f.id} size="small" variant={f.enabled?'filled':'outlined'}
          color={f.enabled?'primary':'default'} label={`${f.field} ${f.operator} ${f.value}`} onDelete={()=>removeFilter(f.id)}
          onClick={()=>updateActive({filters:active.filters.map(x=>x.id===f.id?{...x,enabled:!x.enabled}:x)})}/>)}
        <Button size="small" onClick={()=>updateActive({filters:[]})}>Clear all</Button>
      </Box>}

      {/* Workspace */}
      <Box sx={{ display:'grid', gridTemplateColumns: sidebarVisible ? {xs:'1fr', lg:'240px minmax(0,1fr)'} : 'minmax(0,1fr)', gap:1 }}>
        {sidebarVisible && <Paper variant="outlined" sx={{ minHeight:500, p:1, display:{xs:'none',lg:'block'} }}>
          <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:1}}>
            <Typography variant="subtitle2">Fields</Typography>
            <IconButton size="small" onClick={()=>setSidebarVisible(false)}><KeyboardArrowUpIcon fontSize="small"/></IconButton>
          </Box>
          <TextField fullWidth size="small" placeholder="Search fields…" value={fieldSearch} onChange={e=>setFieldSearch(e.target.value)} slotProps={{ input: { startAdornment:<InputAdornment position="start"><SearchIcon fontSize="small"/></InputAdornment> } }} />
          <Typography variant="overline" color="text.secondary" sx={{display:'block',mt:1}}>Selected fields</Typography>
          <Stack spacing={.25}>
            {active.columns.map(field=><Box key={field} sx={{display:'flex',alignItems:'center',justifyContent:'space-between',px:.5,py:.35,borderRadius:.5,'&:hover':{bgcolor:'action.hover'}}}>
              <Typography variant="body2" sx={{fontFamily:fontMono,fontSize:11}}>{field}</Typography>
              <IconButton size="small" onClick={()=>updateActive({columns:active.columns.filter(c=>c!==field)})}><CloseIcon sx={{fontSize:14}}/></IconButton>
            </Box>)}
          </Stack>
          <Typography variant="overline" color="text.secondary" sx={{display:'block',mt:1}}>Available fields</Typography>
          <Stack spacing={.1}>
            {fieldNames.filter(f=>!active.columns.includes(f)).map(field=><Button key={field} size="small" sx={{justifyContent:'flex-start',fontFamily:fontMono,fontSize:11}} onClick={(e)=>{setSelectedField(field);setFieldAnchor(e.currentTarget)}}>{field}</Button>)}
          </Stack>
          <Button fullWidth size="small" startIcon={<AddIcon/>} sx={{mt:1}} onClick={()=>setColumnOpen(true)}>Add field</Button>
          {selectedField && <FieldPopover field={selectedField} anchorEl={fieldAnchor} onClose={()=>setFieldAnchor(null)} onAdd={f=>updateActive({columns:active.columns.includes(f)?active.columns:[...active.columns,f]})}/>}
        </Paper>}

        <Box sx={{minWidth:0}}>
          {!sidebarVisible && <Button size="small" startIcon={<ViewColumnOutlinedIcon/>} onClick={()=>setSidebarVisible(true)} sx={{mb:1}}>Show fields</Button>}

          {/* Histogram toolbar */}
          {chartVisible && <Paper variant="outlined" sx={{mb:1,overflow:'hidden'}}>
            <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',px:1.25,pt:1}}>
              <Typography variant="caption" color="text.secondary">{filtered.length.toLocaleString()} events</Typography>
              <Tooltip title="Hide chart"><IconButton size="small" onClick={()=>setChartVisible(false)}><KeyboardArrowUpIcon fontSize="small"/></IconButton></Tooltip>
            </Box>
            <MiniHistogram data={histogram}/>
          </Paper>}
          {!chartVisible && <Button size="small" onClick={()=>setChartVisible(true)} sx={{mb:1}}>Show chart</Button>}

          {/* Results toolbar */}
          <Paper variant="outlined">
            <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:1,p:1,borderBottom:1,borderColor:'divider',flexWrap:'wrap'}}>
              <Stack direction="row" spacing={.5} sx={{alignItems:'center'}}>
                <Typography variant="subtitle2">{mode==='classic'?'Documents':'Results'}</Typography>
                <Chip size="small" label={`${filtered.length}`} />
              </Stack>
              <Stack direction="row" spacing={.25}>
                <Tooltip title="Columns"><IconButton size="small" onClick={()=>setColumnOpen(true)}><ViewColumnOutlinedIcon fontSize="small"/></IconButton></Tooltip>
                <Tooltip title="Sort"><IconButton size="small" onClick={()=>setSortOpen(true)}><SortIcon fontSize="small"/></IconButton></Tooltip>
                <Tooltip title="Display options"><IconButton size="small" onClick={()=>setDisplayOpen(true)}><TuneIcon fontSize="small"/></IconButton></Tooltip>
                <Tooltip title="Fullscreen"><IconButton size="small"><FullscreenIcon fontSize="small"/></IconButton></Tooltip>
              </Stack>
            </Box>
            <Box sx={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',tableLayout:'fixed'}}>
                <thead><tr>
                  <th style={{width:40}}></th>
                  {active.columns.map(c=><th key={c} style={{textAlign:dir==='rtl'?'right':'left',padding:'9px 10px',borderBottom:'1px solid var(--divider)',fontSize:12,fontWeight:600,width:c==='message'?360:130}}>{COLUMN_LABELS[c]}</th>)}
                </tr></thead>
                <tbody>
                  {filtered.slice(0,rows).map(log=><tr key={log.id} style={{borderBottom:'1px solid rgba(148,163,184,.08)'}}>
                    <td style={{textAlign:'center'}}><IconButton size="small" onClick={()=>{setDocument(log);setDocumentMode('table')}}><KeyboardArrowDownIcon fontSize="small"/></IconButton></td>
                    {active.columns.map(c=><td key={c} style={{padding:'8px 10px',fontSize:density==='compact'?11:density==='expanded'?13:12,whiteSpace:c==='message'?'nowrap':'normal',overflow:'hidden',textOverflow:'ellipsis',fontFamily:c==='message'||c==='timestamp'?'ui-monospace, SFMono-Regular, Menlo, monospace':'inherit'}}>
                      {c==='timestamp' ? formatTime(log.timestamp) : c==='level' ? <Chip size="small" label={log.level.toUpperCase()} color={log.level==='error'?'error':log.level==='warn'?'warning':'default'} sx={{fontSize:10,fontWeight:700}}/> : log[c as keyof LogEntry]}
                    </td>)}
                  </tr>)}
                </tbody>
              </table>
            </Box>
            <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',p:1,borderTop:1,borderColor:'divider'}}>
              <Typography variant="caption" color="text.secondary">Showing {Math.min(rows,filtered.length)} of {filtered.length}</Typography>
              <Stack direction="row" spacing={.5}>
                <Button size="small" disabled>Previous</Button><Button size="small" disabled={filtered.length<=rows}>Next</Button>
                <Select size="small" value={rows} onChange={e=>setRows(Number(e.target.value))} sx={{height:30}}><MenuItem value={10}>10</MenuItem><MenuItem value={25}>25</MenuItem><MenuItem value={50}>50</MenuItem></Select>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Document flyout */}
      <Dialog open={Boolean(document)} onClose={()=>setDocument(null)} fullWidth maxWidth="md" slotProps={{paper:{sx:{m:0,ml:'auto',mr:0,height:'100%',maxHeight:'100%',borderRadius:0}}}}>
        {document && <>
          <DialogTitle sx={{display:'flex',alignItems:'center',justifyContent:'space-between',pb:1}}>
            <Box><Typography variant="subtitle1">Document</Typography><Typography variant="caption" color="text.secondary" sx={{fontFamily:fontMono}}>{document.id}</Typography></Box>
            <IconButton onClick={()=>setDocument(null)}><CloseIcon/></IconButton>
          </DialogTitle>
          <Box sx={{px:2,borderBottom:1,borderColor:'divider'}}><Tabs value={documentMode} onChange={(_,v)=>setDocumentMode(v)} sx={{minHeight:40,'& .MuiTab-root':{minHeight:40,textTransform:'none'}}}><Tab value="table" icon={<TableViewIcon fontSize="small"/>} iconPosition="start" label="Table"/><Tab value="json" icon={<DataObjectIcon fontSize="small"/>} iconPosition="start" label="JSON"/></Tabs></Box>
          <DialogContent dividers>
            {documentMode==='table' ? <List dense>{ALL_COLUMNS.map(c=><ListItem key={c} divider><ListItemText primary={COLUMN_LABELS[c]} secondary={<Typography component="span" sx={{fontFamily:fontMono,fontSize:12}}>{String(document[c as keyof LogEntry])}</Typography>}/></ListItem>)}</List>
            : <Box component="pre" sx={{fontFamily:fontMono,fontSize:12,whiteSpace:'pre-wrap',wordBreak:'break-word'}}>{JSON.stringify(document,null,2)}</Box>}
          </DialogContent>
          <DialogActions><Button onClick={()=>setDocument(null)}>Close</Button><Button startIcon={<AnalyticsOutlinedIcon/>}>View surrounding documents</Button></DialogActions>
        </>}
      </Dialog>

      {/* Add filter */}
      <Dialog open={filterOpen} onClose={()=>setFilterOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add filter</DialogTitle><DialogContent>
          <Stack spacing={1.5} sx={{pt:1}}>
            <FormControl size="small"><Select value={newFilterField} onChange={e=>setNewFilterField(e.target.value)}>{ALL_COLUMNS.filter(x=>x!=='timestamp'&&x!=='message').map(x=><MenuItem key={x} value={x}>{x}</MenuItem>)}</Select></FormControl>
            <FormControl size="small"><Select value={newFilterOp} onChange={e=>setNewFilterOp(e.target.value as '='|'!=')}><MenuItem value="=">is</MenuItem><MenuItem value="!=">is not</MenuItem></Select></FormControl>
            <TextField size="small" label="Value" value={newFilterValue} onChange={e=>setNewFilterValue(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addFilter()}} autoFocus/>
          </Stack>
        </DialogContent><DialogActions><Button onClick={()=>setFilterOpen(false)}>Cancel</Button><Button variant="contained" onClick={addFilter}>Add filter</Button></DialogActions>
      </Dialog>

      {/* Columns */}
      <Dialog open={columnOpen} onClose={()=>setColumnOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Columns</DialogTitle><DialogContent>
          <List dense>{ALL_COLUMNS.map(c=><ListItem key={c} secondaryAction={<Checkbox checked={active.columns.includes(c)} onChange={()=>updateActive({columns:active.columns.includes(c)?active.columns.filter(x=>x!==c):[...active.columns,c]})}/>}><ListItemText primary={COLUMN_LABELS[c]} secondary={c}/></ListItem>)}</List>
        </DialogContent><DialogActions><Button onClick={()=>setColumnOpen(false)}>Done</Button></DialogActions>
      </Dialog>

      {/* Sort */}
      <Dialog open={sortOpen} onClose={()=>setSortOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Sort fields</DialogTitle><DialogContent>
          <FormControl fullWidth size="small" sx={{mt:1}}><Select value={active.sort.field} onChange={e=>updateActive({sort:{...active.sort,field:e.target.value as keyof LogEntry}})}>{ALL_COLUMNS.map(c=><MenuItem key={c} value={c}>{COLUMN_LABELS[c]}</MenuItem>)}</Select></FormControl>
          <Stack direction="row" spacing={1} sx={{mt:1}}><Button fullWidth variant={active.sort.direction==='asc'?'contained':'outlined'} onClick={()=>updateActive({sort:{...active.sort,direction:'asc'}})}>Ascending</Button><Button fullWidth variant={active.sort.direction==='desc'?'contained':'outlined'} onClick={()=>updateActive({sort:{...active.sort,direction:'desc'}})}>Descending</Button></Stack>
        </DialogContent><DialogActions><Button onClick={()=>setSortOpen(false)}>Done</Button></DialogActions>
      </Dialog>

      {/* Display */}
      <Dialog open={displayOpen} onClose={()=>setDisplayOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Display options</DialogTitle><DialogContent>
          <Typography variant="body2" sx={{mt:1}}>Density</Typography>
          <Stack direction="row" spacing={.5} sx={{mt:1}}>{(['compact','normal','expanded'] as const).map(x=><Button key={x} size="small" variant={density===x?'contained':'outlined'} onClick={()=>setDensity(x)}>{x}</Button>)}</Stack>
          <FormControlLabel sx={{mt:1}} control={<Switch checked={chartVisible} onChange={e=>setChartVisible(e.target.checked)}/>} label="Show chart"/>
          <Typography variant="body2" sx={{mt:1}}>Rows per page</Typography><Slider min={10} max={50} step={5} value={rows} onChange={(_,v)=>setRows(v as number)} valueLabelDisplay="auto"/>
        </DialogContent><DialogActions><Button onClick={()=>setDisplayOpen(false)}>Done</Button></DialogActions>
      </Dialog>

      <InspectDialog
        open={inspectOpen}
        onClose={() => setInspectOpen(false)}
        dataView={active.dataView}
        query={query}
        mode={mode}
        timeRange={active.timeRange}
        filters={active.filters}
        size={rows}
        sort={active.sort}
        filteredLogs={filtered}
      />

      <Dialog open={saveOpen} onClose={()=>setSaveOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Save Discover session</DialogTitle><DialogContent><TextField fullWidth size="small" label="Title" defaultValue={active.title} sx={{mt:1}}/><TextField fullWidth size="small" label="Description" sx={{mt:1}}/></DialogContent><DialogActions><Button onClick={()=>setSaveOpen(false)}>Cancel</Button><Button variant="contained" onClick={()=>setSaveOpen(false)}>Save</Button></DialogActions>
      </Dialog>
      <Dialog open={shareOpen} onClose={()=>setShareOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share</DialogTitle><DialogContent><Typography variant="body2" sx={{mt:1}}>A shareable URL for the current Discover state would be generated here when the backend/session API is connected.</Typography><TextField fullWidth size="small" value="http://localhost:3000/discover?_a=demo-session" sx={{mt:2}} slotProps={{ input: { readOnly:true } }}/></DialogContent><DialogActions><Button onClick={()=>setShareOpen(false)}>Close</Button><Button variant="contained" onClick={()=>setShareOpen(false)}>Copy link</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
