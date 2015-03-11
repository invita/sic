<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\Predicate;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Zend\Authentication\Result;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Models\SicModuleAbs;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;

class PubSearch extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $staticData = Util::getArg($args, 'staticData', array());
        $search = Util::getArg($staticData, 'search', null);
        //if (!$search) return;

        $select->from('view_publication_list');
        /*
        $select->from('publication')
            ->columns(array('id', 'parent_id', 'year', 'cobiss', 'issn', 'original_id'))
            //->join('publication_project_link', 'publication.id = publication_project_link.publication_id',
            //    array('project_id' => new Expression('GROUP_CONCAT(publication_project_link.project_id)')), Select::JOIN_LEFT)
            //->join('publication_title', 'publication.id = publication_title.publication_id',
            //    array('title' => new Expression('SUBSTR(GROUP_CONCAT(publication_title.title), 1, 100)')), Select::JOIN_LEFT)
            //->join('publication_author', 'publication.id = publication_author.publication_id',
            //    array('author' => new Expression('SUBSTR(GROUP_CONCAT(publication_author.author), 1, 100)')), Select::JOIN_LEFT)

            ->join('publication_title', 'publication.id = publication_title.publication_id', array('title'), Select::JOIN_LEFT)
            ->join('publication_author', 'publication.id = publication_author.publication_id', array('author'), Select::JOIN_LEFT)
            ->group('publication.id');
        */

        $where = new Where();
        $where->literal(
            "view_publication_list.title LIKE '%".$search."%' OR ".
            "view_publication_list.author LIKE '%".$search."%'"
        );
        $select->where($where);


    }

    /*
    function search($args) {
        $data = $args['data'];
        $search = $data['search'];

        $sortField = Util::getArg($args, 'sortField', null);
        $sortOrder = Util::getArg($args, 'sortOrder', 'asc');
        $pageStart = intval(Util::getArg($args, 'pageStart', 0));
        $pageCount = intval(Util::getArg($args, 'pageCount', 5));

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select('publication')->columns(array('id', 'parent_id', 'year', 'cobiss', 'issn', 'original_id'))
            ->join('publication_title', 'publication.id = publication_title.publication_id', array('title'), Select::JOIN_LEFT)
            ->join('publication_author', 'publication.id = publication_author.publication_id', array('author'), Select::JOIN_LEFT);

        $where = new Where();
        $where->literal("publication_title.title LIKE '%".$search."%' OR ".
                        "publication_author.author LIKE '%".$search."%'");
        $select->where($where);

        $select->group('publication.id');

        $statement = $sql->prepareStatementForSqlObject($select);
        //echo $statement->getSql()."\n"; die();
        $result = $statement->execute();
        $rowCount = $result->getAffectedRows();

        if ($sortField) $select->order($sortField." ".$sortOrder);
        $select->offset($pageStart);
        $select->limit($pageCount);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();

        $array = array();
        foreach($result as $row) {
            $array[] = $row;
        }

        return array("data" => $array, "rowCount" => $rowCount);
    }
    */
}