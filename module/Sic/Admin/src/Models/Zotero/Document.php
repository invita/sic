<?php
namespace Sic\Admin\Models\Zotero;

class Document {

    protected $idno = array();
    public function addIdno($value, $codeId){ array_push($this->idno, array("value"=>$value, "codeId"=>$codeId)); }

    protected $title = array();
    public function addTitle($value){ array_push($this->title, $value); }

    protected $creator = array();
    public function addCreator($value, $codeId){ array_push($this->creator, array("value"=>$value, "codeId"=>$codeId)); }

    protected $year = array();
    public function addYear($value){ array_push($this->year, $value); }

    protected $addidno = array();
    public function addAddIdno($value){ array_push($this->addidno, $value); }

    protected $addtitle = array();
    public function addAddTitle($value){ array_push($this->addtitle, $value); }

    protected $place = array();
    public function addPlace($value){ array_push($this->place, $value); }

    protected $publisher = array();
    public function addPublisher($value){ array_push($this->publisher, $value); }

    protected $volume = array();
    public function addVolume($value){ array_push($this->volume, $value); }

    protected $issue = array();
    public function addIssue($value){ array_push($this->issue, $value); }

    protected $page = array();
    public function addPage($value){ array_push($this->page, $value); }

    protected $edition = array();
    public function addEdition($value){ array_push($this->edition, $value); }

    protected $source = array();
    public function addSource($value, $codeId){ array_push($this->source, array("value"=>$value, "codeId"=>$codeId)); }

    protected $online = array();
    public function addOnline($value, $codeId){ array_push($this->online, array("value"=>$value, "codeId"=>$codeId)); }

    protected $strng = array();
    public function addStrng($value){ array_push($this->strng, $value); }

    protected $note = array();
    public function addNote($value){ array_push($this->note, $value); }


    public function toArray(){
        return array(
            "idno" => $this->idno,
            "title" => $this->title,
            "creator" => $this->creator,
            "year" => $this->year,
            "addidno" => $this->addidno,
            "addtitle" => $this->addtitle,
            "place" => $this->place,
            "publisher" => $this->publisher,
            "volume" => $this->volume,
            "issue" => $this->issue,
            "page" => $this->page,
            "edition" => $this->edition,
            "source" => $this->source,
            "online" => $this->online,
            "strng" => $this->strng,
            "note" => $this->note,
        );
    }

}